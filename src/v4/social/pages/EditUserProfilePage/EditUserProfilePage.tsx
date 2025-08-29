import React, { useEffect, useRef, useState } from 'react';
import styles from './EditUserProfilePage.module.css';
import Camera from '~/v4/icons/Camera';
import { Form } from 'react-aria-components';
import { BackButton } from '~/v4/social/elements/BackButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Title } from '~/v4/social/elements/Title/Title';
import { Button as CoreButton } from '~/v4/core/natives/Button/Button';
import { UpdateUserProfileButton } from '~/v4/social/elements/UpdateUserProfileButton';
import { UserAvatar } from '~/v4/social/elements/UserAvatar/UserAvatar';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useMutation } from '@tanstack/react-query';
import { FileRepository, UserRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { UnderlineInput } from '~/v4/social/internal-components/UnderlineInput';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';
import { useNetworkState } from 'react-use';
import InputText from '~/v4/core/components/InputText';
import { Button, Typography } from '~/v4/core/components';
import Switch from '~/core/components/Switch';
import Select from '~/core/components/Select';
import { Betting, Poker, CardGames } from '~/icons';

interface EditUserProfilePageProps {
  userId: string;
}

const MAX_DISPLAY_NAME_LENGTH = 100;
const MAX_ABOUT_LENGTH = 180;

export const EditUserProfilePage: React.FC<EditUserProfilePageProps> = ({ userId }) => {
  const pageId = 'edit_user_profile_page';
  const notification = useNotifications();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { themeStyles } = useAmityPage({ pageId });
  const { onBack } = useNavigation();
  const { online } = useNetworkState();
  const { confirm, info } = useConfirmContext();
  const { user } = useUser({ userId });

  const [displayName, setDisplayName] = useState(user?.displayName || undefined);
  const [description, setDescription] = useState(user?.description || undefined);
  const [image, setImage] = useState<File | null>(null);
  const [newImage, setNewImage] = useState<Amity.File<'image'> | null>(null);

  const [selectedGames, setSelectedGames] = useState<string[]>(['poker', 'scommesse']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['tecnologia', 'sport']);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([
    'condividere-passioni',
    'condividere-successi',
  ]);
  const [selectedPlayerTypes, setSelectedPlayerTypes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('roma');

  const [bioVisible, setBioVisible] = useState(false);
  const [gamesVisible, setGamesVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);
  const [interestsVisible, setInterestsVisible] = useState(false);
  const [objectivesVisible, setObjectivesVisible] = useState(true);
  const [playerTypesVisible, setPlayerTypesVisible] = useState(false);

  const mockGames = [
    { id: 'poker', name: 'Poker' },
    { id: 'scommesse', name: 'Scommesse' },
    { id: 'blackjack', name: 'Blackjack' },
    { id: 'roulette', name: 'Roulette' },
    { id: 'slot', name: 'Slot' },
    { id: 'bingo', name: 'Bingo' },
    { id: 'casino-live', name: 'Casino Live' },
    { id: 'gratta-e-vinci', name: 'Gratta e Vinci' },
  ];

  const mockInterests = [
    { id: 'fotografia', name: 'Fotografia' },
    { id: 'viaggi', name: 'Viaggi' },
    { id: 'motori', name: 'Motori' },
    { id: 'tecnologia', name: 'Tecnologia' },
    { id: 'sport', name: 'Sport' },
    { id: 'videogiochi', name: 'Videogiochi' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'musica', name: 'Musica' },
  ];

  const mockCities = [
    { value: 'roma', name: 'Roma' },
    { value: 'milano', name: 'Milano' },
    { value: 'napoli', name: 'Napoli' },
    { value: 'torino', name: 'Torino' },
    { value: 'firenze', name: 'Firenze' },
  ];

  const mockObjectives = [
    { id: 'conoscere-nuove-persone', name: 'Conoscere nuove persone' },
    { id: 'condividere-passioni', name: 'Condividere passioni' },
    { id: 'scambiare-consigli', name: 'Scambiare consigli e strategie' },
    { id: 'condividere-successi', name: 'Condividere successi e risultati' },
    { id: 'crescere-migliorare', name: 'Crescere e migliorare nel gioco' },
    { id: 'nessuna-precedenti', name: 'Nessuna delle precedenti' },
  ];

  const mockPlayerTypes = [
    {
      id: 'scommesse',
      name: 'Scommesse',
      icon: 'betting',
      levels: [1, 2, 3, 4, 5],
      selectedLevel: 4,
    },
    {
      id: 'poker',
      name: 'Poker',
      icon: 'poker',
      levels: [1, 2, 3, 4, 5],
      selectedLevel: 2,
    },
    {
      id: 'giochi-carte',
      name: 'Giochi di carte',
      icon: 'cards',
      levels: [1, 2, 3, 4, 5],
      selectedLevel: 3,
    },
  ];

  const [playerTypeLevels, setPlayerTypeLevels] = useState<{ [key: string]: number }>({
    scommesse: 4,
    poker: 2,
    'giochi-carte': 3,
  });

  const toggleSelection = (
    id: string,
    selectedArray: string[],
    setSelectedArray: (arr: string[]) => void,
  ) => {
    if (selectedArray.includes(id)) {
      setSelectedArray(selectedArray.filter((item) => item !== id));
    } else {
      setSelectedArray([...selectedArray, id]);
    }
  };

  useEffect(() => {
    user?.displayName && setDisplayName(user.displayName);
    user?.description && setDescription(user.description);
  }, [user?.displayName, user?.description]);

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append('files', image);
    try {
      const { data } = await FileRepository.uploadImage(formData);
      setNewImage(data[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.IMAGE_NUDITY)) {
        info({
          pageId: pageId,
          type: 'info',
          title: 'Inappropriate image',
          content: 'Please choose a different image to upload.',
        });
      } else {
        info({
          pageId: pageId,
          type: 'info',
          title: 'Failed to upload image',
          content: 'Please try again.',
        });
      }
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage(image);
    }
  }, [image]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [description]);

  const useMutateEditUserProfile = () =>
    useMutation({
      mutationFn: async (params: Parameters<typeof UserRepository.updateUser>[1]) => {
        return await UserRepository.updateUser(userId, params);
      },
      onSuccess: () => {
        onBack();
        notification.success({ content: 'Successfully updated your profile!' });
      },
      onError: (error) => {
        if (
          error.message === 'Amity SDK (400301): Only administrator can update user display name.'
        ) {
          notification.error({ content: 'Only administrator can update user display name.' });
          return;
        }
        notification.error({ content: 'Failed to save your profile. Please try again.' });
      },
    });

  const { mutateAsync: mutateUpdateEditUserProfile, isPending } = useMutateEditUserProfile();

  const submitForm = (e: any) => {
    const updatedValue = {
      displayName: displayName !== user?.displayName ? displayName : undefined,
      description: description !== user?.description ? description : undefined,
      avatarFileId: newImage?.fileId,
    };
    e.preventDefault();
    if (!online) {
      notification.info({ content: 'Failed to save your profile. Please try again.' });
      return;
    }
    user?.userId && mutateUpdateEditUserProfile(updatedValue);
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    fileInput.click();
  };

  const onChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setImage(e.target.files?.[0] || null);
  };

  const isNoEditing =
    !displayName ||
    ((user?.displayName === displayName || (user?.displayName == undefined && displayName == '')) &&
      (user?.description === description ||
        (user?.description == undefined && description == '')) &&
      !newImage);

  const onPressBackButton = () => {
    if (!isNoEditing)
      confirm({
        pageId: pageId,
        type: 'confirm',
        title: 'Unsaved changes',
        content:
          'Are you sure you want to discard the changes? They will be lost when you leave this page.',
        onOk: () => {
          onBack();
        },
        okText: 'Discard',
        cancelText: 'Cancel',
      });
    else onBack();
  };

  return (
    <div className={styles.editUserProfilePage} style={themeStyles}>
      <div className={styles.editUserProfilePage__topSection}>
        <BackButton
          pageId={pageId}
          onPress={onPressBackButton}
          defaultClassName={styles.editUserProfilePage__topSection__backButton}
        />
        <Title
          pageId={pageId}
          componentId={userId}
          titleClassName={styles.editUserProfilePage__topSection__title}
        />
      </div>
      <Form onSubmit={submitForm} className={styles.editUserProfilePage__form}>
        <div className={styles.editUserProfilePage__cardPositioner}>
          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>Chi sei in community</Typography.BodyBold>
            </div>
            <div
              className={`${styles.editUserProfilePage__cardContentSection} ${styles.editUserProfilePage__avatarSection}`}
            >
              <div className={styles.editUserProfilePage__avatarContainer}>
                {newImage ? (
                  <img
                    src={newImage.fileUrl}
                    alt="avatar"
                    className={styles.editUserProfilePage__avatar}
                  />
                ) : (
                  <UserAvatar
                    userId={userId}
                    className={styles.editUserProfilePage__avatar}
                    textPlaceholderClassName={styles.editUserProfilePage__avatarPlaceholder}
                  />
                )}
                <CoreButton
                  className={styles.editUserProfilePage__avatarOverlay}
                  onPress={triggerFileInput}
                >
                  <Camera className={styles.editUserProfilePage__icon} />
                  <input
                    type="file"
                    onChange={onChangeImage}
                    multiple
                    id="image-upload"
                    accept="image/png,image/jpg"
                    className={styles.editUserProfilePage__imageInput}
                  />
                </CoreButton>
              </div>
            </div>
            <div className={`${styles.editUserProfilePage__cardContentSection} text-center`}>
              <Typography.Caption>Oppure</Typography.Caption>
            </div>
            <div className={`${styles.editUserProfilePage__cardContentSection} text-center`}>
              <Typography.Caption>Scegli un avatar </Typography.Caption>
            </div>
          </div>

          {/* <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <UnderlineInput
                name="userDisplayName"
                pageId={pageId}
                elementId="user_display_name_title"
                maxLength={MAX_DISPLAY_NAME_LENGTH}
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDisplayName(e.target.value)
                }
                showCounter={true}
                // TODO: Add condition to disable/enable the input when we have sdk api to check the user setting
                // disabled={true}
              />
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <UnderlineInput
                name="userAbout"
                pageId={pageId}
                elementId="user_about_title"
                maxLength={MAX_ABOUT_LENGTH}
                value={description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setDescription(e.target.value)
                }
                showCounter={true}
                optional={true}
              />
            </div>
          </div> */}

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>La tua Bio</Typography.BodyBold>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <InputText
                value={description || ''}
                placeholder="Raccontaci di te"
                multiline={true}
                rows={5}
                floatingPlaceholder={true}
                onChange={(data) => setDescription(data.text)}
                className={styles.editUserProfilePage__fullWidth}
              />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={bioVisible} onChange={setBioVisible} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>Preferenze di gioco</Typography.BodyBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div className={styles.editUserProfilePage__gameTagsContainerWrap}>
                {mockGames.map((game) => (
                  <Button
                    key={game.id}
                    type="button"
                    variant="secondary"
                    className={`${styles.editUserProfilePage__segmentedControlWrap} ${
                      selectedGames.includes(game.id)
                        ? styles.editUserProfilePage__segmentedControlActive
                        : ''
                    }`}
                    onClick={() => toggleSelection(game.id, selectedGames, setSelectedGames)}
                  >
                    {game.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={gamesVisible} onChange={setGamesVisible} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>La tua città</Typography.BodyBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <Select
                placeholder="Seleziona la tua città"
                value={
                  selectedCity
                    ? [
                        {
                          name: mockCities.find((c) => c.value === selectedCity)?.name || '',
                          value: selectedCity,
                        },
                      ]
                    : []
                }
                options={mockCities.map((city) => ({ name: city.name, value: city.value }))}
                onSelect={(option) => setSelectedCity(option.value)}
                floatingLabel
                renderItem={({ name }) => <div>{name}</div>}
                className={styles.editUserProfilePage__fullWidth}
              />
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={cityVisible} onChange={setCityVisible} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>I tuoi interessi</Typography.BodyBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div className={styles.editUserProfilePage__gameTagsContainerWrap}>
                {mockInterests.map((interest) => (
                  <Button
                    key={interest.id}
                    type="button"
                    variant="secondary"
                    className={`${styles.editUserProfilePage__segmentedControlWrap} ${
                      selectedInterests.includes(interest.id)
                        ? styles.editUserProfilePage__segmentedControlActive
                        : ''
                    }`}
                    onClick={() =>
                      toggleSelection(interest.id, selectedInterests, setSelectedInterests)
                    }
                  >
                    {interest.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={interestsVisible} onChange={setInterestsVisible} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>I tuoi obiettivi</Typography.BodyBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div className={styles.editUserProfilePage__gameTagsContainer}>
                {mockObjectives.map((objective) => (
                  <Button
                    key={objective.id}
                    type="button"
                    variant="secondary"
                    className={`${styles.editUserProfilePage__segmentedControl} ${
                      selectedObjectives.includes(objective.id)
                        ? styles.editUserProfilePage__segmentedControlActive
                        : ''
                    }`}
                    onClick={() =>
                      toggleSelection(objective.id, selectedObjectives, setSelectedObjectives)
                    }
                  >
                    {objective.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={objectivesVisible} onChange={setObjectivesVisible} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <div className={styles.editUserProfilePage__card}>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Typography.BodyBold>Che tipo di giocatore sei?</Typography.BodyBold>
            </div>

            <div className={styles.editUserProfilePage__cardContentSection}>
              <div className={styles.editUserProfilePage__playerTypeContainer}>
                {mockPlayerTypes.map((playerType) => (
                  <div key={playerType.id} className={styles.editUserProfilePage__playerTypeItem}>
                    <div className={styles.editUserProfilePage__playerTypeHeader}>
                      {playerType.icon === 'betting' && <Betting width={24} height={24} />}
                      {playerType.icon === 'poker' && <Poker width={24} height={24} />}
                      {playerType.icon === 'cards' && <CardGames width={24} height={24} />}
                      <Typography.CaptionBold>{playerType.name}</Typography.CaptionBold>
                    </div>
                    <div className={styles.editUserProfilePage__playerTypeLevels}>
                      {playerType.levels.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant="secondary"
                          className={`${styles.editUserProfilePage__levelButton} ${
                            level <= (playerTypeLevels[playerType.id] || 0)
                              ? styles.editUserProfilePage__levelButtonActive
                              : ''
                          }`}
                          onClick={() =>
                            setPlayerTypeLevels((prev) => ({
                              ...prev,
                              [playerType.id]: level,
                            }))
                          }
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                    <div className={styles.editUserProfilePage__playerTypeLevelLabels}>
                      <Typography.Caption>Principiante</Typography.Caption>
                      <Typography.Caption>Esperto</Typography.Caption>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.editUserProfilePage__cardContentSection}>
              <Switch value={playerTypesVisible} onChange={setPlayerTypesVisible} />
              <Typography.CaptionSmall>Visibile nel tuo profilo</Typography.CaptionSmall>
            </div>
          </div>

          <UpdateUserProfileButton pageId={pageId} disabled={isNoEditing || isPending} />
        </div>
      </Form>
    </div>
  );
};
