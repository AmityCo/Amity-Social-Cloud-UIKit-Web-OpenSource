import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import useSDK from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { FileRepository } from '@amityco/ts-sdk';
import styles from './TopBar.module.css';

interface TopBarProps {
  onClickUserProfile?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onClickUserProfile }) => {
  const { currentUserId } = useSDK();
  const { user } = useUser({ userId: currentUserId });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName =
    (user as Record<string, any>)?.displayName || (user as Record<string, any>)?.userId || '';
  const firstChar = displayName?.trim().charAt(0).toUpperCase() || '';

  const avatarUrl = useMemo(() => {
    const url = (user as Record<string, any>)?.avatar?.fileUrl;
    if (!url) return undefined;
    return FileRepository.fileUrlWithSize(url, 'small');
  }, [(user as Record<string, any>)?.avatar?.fileUrl]);

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleProfileClick = useCallback(() => {
    setIsDropdownOpen(false);
    onClickUserProfile?.();
  }, [onClickUserProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className={styles.topBar}>
      <div className={styles.topBar__profileWrapper} ref={dropdownRef}>
        <button
          className={styles.topBar__profileButton}
          onClick={handleToggleDropdown}
          aria-label="User profile menu"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className={styles.topBar__avatar} />
          ) : (
            <div className={styles.topBar__avatarPlaceholder}>{firstChar}</div>
          )}
          <span className={styles.topBar__userName}>{displayName}</span>
          <ChevronDown className={styles.topBar__chevron} />
        </button>

        {isDropdownOpen && (
          <div className={styles.topBar__dropdown}>
            <button className={styles.topBar__dropdownItem} onClick={handleProfileClick}>
              <svg
                className={styles.topBar__dropdownItemIcon}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
              My Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
