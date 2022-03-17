import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PollAnswerType } from '@amityco/js-sdk';
import { useForm, Controller } from 'react-hook-form';
import useSocialMention from '~/social/hooks/useSocialMention';

import {
  PollComposerContainer,
  Form,
  FormBlockBody,
  FormBlockContainer,
  Field,
  ErrorMessage,
  FormBody,
  Footer,
  LabelContainer,
  SubmitButton,
  Label,
  ControllerContainer,
  FieldContainer,
  Counter,
  LabelWrapper,
  MentionTextInput,
} from './styles';

import OptionsComposer from '~/social/components/post/PollComposer/OptionsComposer';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import InputCounter, { COUNTER_VALUE_PLACEHOLDER } from '~/core/components/InputCounter';
import AnswerTypeSelector from '~/social/components/post/PollComposer/AnswerTypeSelector';
import useElement from '~/core/hooks/useElement';
import Button from '~/core/components/Button';
import { extractMetadata } from '~/helpers/utils';
import { MAXIMUM_MENTIONEES } from '~/social/constants';
import { info } from '~/core/components/Confirm';

const MAX_QUESTION_LENGTH = 500;
const MIN_OPTIONS_AMOUNT = 2;
const MAX_OPTIONS_AMOUNT = 10;
const MILLISECONDS_IN_DAY = 86400000;

const FormBlock = ({ children }) => (
  <FormBlockContainer>
    <FormBlockBody>{children}</FormBlockBody>
  </FormBlockContainer>
);

const PollComposer = ({
  className,
  targetId,
  targetType,
  onCancel = () => {},
  onSubmit = () => {},
  setDirtyExternal = () => {},
}) => {
  const {
    text,
    markup,
    mentions,
    queryMentionees,
    onChange: mentionOnChange,
  } = useSocialMention({ targetId, targetType });

  const defaultValues = {
    question: '',
    answers: [],
    answerType: PollAnswerType.Single,
    closedIn: 0,
  };

  const {
    register,
    handleSubmit,
    errors,
    setError,
    watch,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues,
  });

  const { formatMessage } = useIntl();

  const question = watch('question', '');
  const answers = watch('answers', []);

  useEffect(() => setDirtyExternal(isDirty), [isDirty, setDirtyExternal]);

  const [validateAndSubmit, submitting] = useAsyncCallback(async (data) => {
    if (!data.question.trim()) {
      setError('question', { message: 'Question cannot be empty' });
      return;
    }

    if (data?.answers?.length < MIN_OPTIONS_AMOUNT) {
      setError('answers', { message: `Minimum amount of answers should be ${MIN_OPTIONS_AMOUNT}` });
      return;
    }

    if (data?.answers?.length > MAX_OPTIONS_AMOUNT) {
      setError('answers', { message: `Maximum amount of answers should be ${MAX_OPTIONS_AMOUNT}` });
      return;
    }

    const { mentionees, metadata = {} } = extractMetadata(markup, mentions);

    const payload = {
      question: data?.question,
      answers: data?.answers?.length ? data.answers : undefined,
      answerType: data?.answerType || PollAnswerType.Single,
      // eslint-disable-next-line no-unsafe-optional-chaining
      closedIn: data?.closedIn * MILLISECONDS_IN_DAY,
    };

    await onSubmit(payload, mentionees, metadata);
  });

  const disabled = !isDirty || question.length === 0 || submitting;

  const [formBodyRef, formBodyElement] = useElement();

  return (
    <PollComposerContainer>
      <Form className={className} onSubmit={handleSubmit(validateAndSubmit)}>
        <FormBody ref={formBodyRef}>
          <FormBlock>
            <Field>
              <LabelWrapper>
                <LabelContainer>
                  <Label className="required">
                    <FormattedMessage id="poll_composer.question.label" />
                  </Label>
                </LabelContainer>
                <Counter>{`${text?.length ?? 0}/${MAX_QUESTION_LENGTH}`}</Counter>
              </LabelWrapper>
              <Controller
                control={control}
                name="question"
                rules={{
                  required: 'Question is required',
                  maxLength: {
                    value: MAX_QUESTION_LENGTH,
                    message: 'Question is too long',
                  },
                }}
                render={({ value, ref, onChange: pollOnChange, ...rest }) => {
                  return (
                    <MentionTextInput
                      {...rest}
                      ref={ref}
                      mentionAllowed
                      multiline
                      value={markup}
                      queryMentionees={queryMentionees}
                      placeholder={formatMessage({ id: 'poll_composer.question.placeholder' })}
                      onChange={({ plainText, mentions: mentionUsers, ...args }) => {
                        if (mentionUsers?.length > MAXIMUM_MENTIONEES) {
                          return info({
                            title: <FormattedMessage id="pollComposer.unableToMention" />,
                            content: <FormattedMessage id="pollComposer.overMentionees" />,
                            okText: <FormattedMessage id="pollComposer.okText" />,
                            type: 'info',
                          });
                        }
                        mentionOnChange({ plainText, mentions: mentionUsers, ...args });
                        pollOnChange(plainText);
                      }}
                    />
                  );
                }}
              />
              <ErrorMessage errors={errors} name="question" />
            </Field>
            <Field>
              <LabelWrapper>
                <LabelContainer>
                  <Label className="required">
                    <FormattedMessage id="poll_composer.poll_options.label" />
                  </Label>
                </LabelContainer>
                <Counter>{`${answers.length}/${MAX_OPTIONS_AMOUNT}`}</Counter>
              </LabelWrapper>
              <Controller
                ref={register({
                  required: 'There should be at least 2 answers',
                  minLength: {
                    value: MIN_OPTIONS_AMOUNT,
                    message: `There should be at least ${MIN_OPTIONS_AMOUNT} answers`,
                  },
                  maxLength: {
                    value: MAX_OPTIONS_AMOUNT,
                    message: `There can be only ${MAX_OPTIONS_AMOUNT} answers maximum`,
                  },
                })}
                name="answers"
                control={control}
                render={({ onChange, ...rest }) => (
                  <OptionsComposer
                    optionsLimit={MAX_OPTIONS_AMOUNT}
                    onChange={onChange}
                    {...rest}
                  />
                )}
                defaultValue={null}
              />
              <ErrorMessage errors={errors} name="answers" />
            </Field>
            <Field horizontal separate>
              <FieldContainer>
                <LabelContainer>
                  <Label>
                    <FormattedMessage id="poll_modal.answer_type.title" />
                  </Label>
                  <div>
                    <FormattedMessage id="poll_modal.answer_type.body" />
                  </div>
                </LabelContainer>
                <ControllerContainer>
                  <Controller
                    ref={register({ required: 'Answer type is required' })}
                    name="answerType"
                    render={(props) => (
                      <AnswerTypeSelector parentContainer={formBodyElement} {...props} />
                    )}
                    control={control}
                    defaultValue=""
                  />
                </ControllerContainer>
              </FieldContainer>
            </Field>
            <Field horizontal separate>
              <FieldContainer>
                <LabelContainer>
                  <Label>
                    <FormattedMessage id="poll_modal.closed_in.title" />
                  </Label>
                  <div>
                    <FormattedMessage id="poll_modal.closed_in.body" />
                  </div>
                </LabelContainer>
                <ControllerContainer>
                  <Controller
                    ref={register()}
                    name="closedIn"
                    render={(props) => (
                      <InputCounter
                        {...props}
                        onlyPositiveNumber
                        resultFormat={`${COUNTER_VALUE_PLACEHOLDER} days`}
                      />
                    )}
                    control={control}
                    defaultValue=""
                  />
                </ControllerContainer>
              </FieldContainer>
            </Field>
          </FormBlock>
        </FormBody>
        <Footer>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onCancel();
            }}
          >
            <FormattedMessage id="cancel" />
          </Button>
          <SubmitButton disabled={disabled}>
            <FormattedMessage id="post" />
          </SubmitButton>
        </Footer>
      </Form>
    </PollComposerContainer>
  );
};

export default PollComposer;
