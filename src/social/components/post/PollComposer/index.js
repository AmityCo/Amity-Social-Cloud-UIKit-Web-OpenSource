import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PollAnswerType } from '@amityco/js-sdk';
import { useForm, Controller } from 'react-hook-form';

import {
  PollComposerContainer,
  Form,
  FormBlockBody,
  FormBlockContainer,
  Field,
  TextInput,
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
} from './styles';

import OptionsComposer from '~/social/components/post/PollComposer/OptionsComposer';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import InputCounter, { COUNTER_VALUE_PLACEHOLDER } from '~/core/components/InputCounter';
import AnswerTypeSelector from '~/social/components/post/PollComposer/AnswerTypeSelector';
import useElement from '~/core/hooks/useElement';
import Button from '~/core/components/Button';

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
  onCancel = () => {},
  onSubmit = () => {},
  setDirtyExternal = () => {},
}) => {
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

  useEffect(() => setDirtyExternal(isDirty), [isDirty]);

  const [validateAndSubmit, submitting] = useAsyncCallback(async data => {
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

    const payload = {
      question: data?.question,
      answers: data?.answers?.length ? data.answers : undefined,
      answerType: data?.answerType || PollAnswerType.Single,
      closedIn: data?.closedIn * MILLISECONDS_IN_DAY,
    };

    await onSubmit(payload);
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
                <Counter>{`${question.length}/${MAX_QUESTION_LENGTH}`}</Counter>
              </LabelWrapper>
              <TextInput
                placeholder={formatMessage({ id: 'poll_composer.question.placeholder' })}
                id="question"
                name="question"
                ref={register({
                  required: 'Question is required',
                  maxLength: {
                    value: MAX_QUESTION_LENGTH,
                    message: 'Question is too long',
                  },
                })}
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
                name="answers"
                control={control}
                render={({ onChange, ...rest }) => (
                  <OptionsComposer
                    onChange={onChange}
                    optionsLimit={MAX_OPTIONS_AMOUNT}
                    {...rest}
                  />
                )}
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
                    name="answerType"
                    ref={register({ required: 'Answer type is required' })}
                    render={props => (
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
                    name="closedIn"
                    ref={register()}
                    render={props => (
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
            onClick={e => {
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
