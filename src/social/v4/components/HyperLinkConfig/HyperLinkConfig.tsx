import React from 'react';
import { BottomSheet } from '~/core/v4/components';

import {
  MobileSheet,
  MobileSheetContainer,
  MobileSheetContent,
  MobileSheetHeader,
} from '~/core/v4/components/BottomSheet/styles';

import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Description,
  Form,
  HyperlinkFormContainer,
  Input,
  Label,
  ErrorText,
  InputContainer,
  CharacterCount,
  LabelContainer,
  HeaderContainer,
  HeaderTitle,
  StyledSecondaryButton,
  RemoveLinkButton,
  RemoveIcon,
  Divider,
} from './styles';
import { SecondaryButton } from '~/core/components/Button';
import { confirm } from '~/core/components/Confirm';
import useSDK from '~/core/hooks/useSDK';
import { useCustomization } from '../../providers/CustomizationProvider';

interface HyperLinkConfigProps {
  pageId: '*';
  isHaveHyperLink: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onRemove: () => void;
}

const MAX_LENGTH = 30;

export const HyperLinkConfig = ({
  pageId = '*',
  isOpen,
  isHaveHyperLink,
  onClose,
  onSubmit,
  onRemove,
}: HyperLinkConfigProps) => {
  const componentId = 'hyper_link_config_component';
  const { getConfig } = useCustomization();
  const componentConfig = getConfig(`${pageId}/${componentId}/*`);
  const componentTheme = componentConfig?.component_theme.light_theme || {};

  const cancelButtonConfig = getConfig(`*/hyper_link_config_component/cancel_button`);
  const doneButtonConfig = getConfig(`*/hyper_link_config_component/done_button`);

  const { formatMessage } = useIntl();
  const { client } = useSDK();

  const schema = z.object({
    url: z.string().refine(async (value) => {
      if (!value) return true;
      // since validateUrls() will throw an error if the url is not whitelisted so need to catch it and return false instead
      const hasWhitelistedUrls = await client?.validateUrls([value]).catch(() => false);
      return hasWhitelistedUrls;
    }, formatMessage({ id: 'storyCreation.hyperlink.validation.error.whitelisted' })),
    customText: z
      .string()
      .optional()
      .refine(async (value) => {
        if (!value) return true;
        // since validateUrls() will throw an error if the url is not whitelisted so need to catch it and return false instead
        // TO FIX: use schema.safeParseAsync()
        const hasBlockedWord = await client?.validateTexts([value]).catch(() => false);
        return hasBlockedWord;
      }, formatMessage({ id: 'storyCreation.hyperlink.validation.error.blocked' })),
  });

  type HyperLinkFormInputs = z.infer<typeof schema>;

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HyperLinkFormInputs>({
    resolver: zodResolver(schema),
  });

  const onSubmitForm = async (data: HyperLinkFormInputs) => {
    onSubmit(data);
    onClose();
  };

  const confirmDiscardHyperlink = () => {
    onRemove();
    onClose();
  };

  const discardHyperlink = () => {
    confirm({
      title: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.title' }),
      content: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.content' }),
      cancelText: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.cancel' }),
      okText: formatMessage({ id: 'storyCreation.hyperlink.removeConfirm.confirm' }),
      onOk: confirmDiscardHyperlink,
    });
  };

  return (
    <BottomSheet
      detent="full-height"
      mountPoint={document.getElementById('asc-uikit-create-story') as HTMLElement}
      rootId="asc-uikit-create-story"
      isOpen={isOpen}
      onClose={onClose}
    >
      <MobileSheetContainer>
        <MobileSheet.Header
          style={{
            backgroundColor: componentTheme?.primary_color,
            color: componentTheme?.secondary_color,
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
          }}
        />
        <MobileSheetHeader
          style={{
            backgroundColor: componentTheme?.primary_color,
            color: componentTheme?.secondary_color,
          }}
        >
          <HeaderContainer>
            <SecondaryButton onClick={onClose}>
              {cancelButtonConfig?.cancel_button_text ||
                formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.cancel' })}
              {cancelButtonConfig?.cancel_icon && (
                <img src={cancelButtonConfig?.cancel_icon} width={16} height={16} />
              )}
            </SecondaryButton>
            <HeaderTitle>
              {formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.title' })}
            </HeaderTitle>
            <StyledSecondaryButton
              style={{
                backgroundColor:
                  doneButtonConfig?.background_color || componentTheme?.primary_color,
                color: componentTheme?.secondary_color,
              }}
              form="asc-story-hyperlink-form"
              type="submit"
            >
              {doneButtonConfig?.done_button_text ||
                formatMessage({ id: 'storyCreation.hyperlink.bottomSheet.submit' })}
              {doneButtonConfig?.done_icon && (
                <img src={doneButtonConfig.done_icon} width={16} height={16} />
              )}
            </StyledSecondaryButton>
          </HeaderContainer>
        </MobileSheetHeader>
        <MobileSheetContent
          style={{
            backgroundColor: componentTheme?.primary_color,
            color: componentTheme?.secondary_color,
          }}
        >
          <HyperlinkFormContainer>
            <Form id="asc-story-hyperlink-form" onSubmit={handleSubmit(onSubmitForm)}>
              <InputContainer>
                <Label required htmlFor="asc-uikit-hyperlink-input-url">
                  {formatMessage({ id: 'storyCreation.hyperlink.form.urlLabel' })}
                </Label>
                <Input
                  id="asc-uikit-hyperlink-input-url"
                  placeholder={formatMessage({ id: 'storyCreation.hyperlink.form.urlPlaceholder' })}
                  hasError={!!errors?.url}
                  {...register('url')}
                />
                {errors?.url && <ErrorText>{errors?.url?.message}</ErrorText>}
              </InputContainer>
              <InputContainer>
                <LabelContainer>
                  <Label htmlFor="asc-uikit-hyperlink-input-link-text">
                    {formatMessage({ id: 'storyCreation.hyperlink.form.linkTextLabel' })}
                  </Label>
                  <CharacterCount>
                    {watch('customText')?.length} / {MAX_LENGTH}
                  </CharacterCount>
                </LabelContainer>
                <Input
                  id="asc-uikit-hyperlink-input-link-text"
                  placeholder={formatMessage({
                    id: 'storyCreation.hyperlink.form.linkTextPlaceholder',
                  })}
                  hasError={!!errors?.customText}
                  {...register('customText')}
                />
                {errors?.customText && <ErrorText>{errors?.customText?.message}</ErrorText>}
                <Description>
                  {formatMessage({ id: 'storyCreation.hyperlink.form.linkTextDescription' })}
                </Description>
              </InputContainer>
              {isHaveHyperLink && (
                <InputContainer>
                  <RemoveLinkButton onClick={discardHyperlink}>
                    <RemoveIcon />
                    {formatMessage({ id: 'storyCreation.hyperlink.form.removeButton' })}
                  </RemoveLinkButton>
                  <Divider />
                </InputContainer>
              )}
            </Form>
          </HyperlinkFormContainer>
        </MobileSheetContent>
      </MobileSheetContainer>
    </BottomSheet>
  );
};
