import React, { useState } from 'react';
import styled from 'styled-components';
import kilowattImage from '../assets/image.png';
import colors from '../assets/colors';

const Header = ({ 
  activePage, 
  onNavigate, 
  onLogout, 
  searchQuery = '', 
  onSearchChange = () => {},
  onSearch = () => {},
  showSearch = true 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProfileAction = (action) => {
    if (action === 'logout') {
      onLogout();
    }
  };

  const navigationItems = [
    { id: 'home', label: 'Home' },
    { id: 'task-queue', label: 'Task Queue' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'managers', label: 'Managers' },
    { id: 'email-drafts', label: 'Email Drafts' },
    { id: 'commissions', label: 'Commissions' },
    { id: 'providers', label: 'Providers' },
    { id: 'system-health', label: 'System Health' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <NavigationBar>
      <NavLeft>
        <LogoSection>
          <LogoImage src={kilowattImage} alt="Kilowatt" />
          <LogoText>Kilowatt</LogoText>
        </LogoSection>
      </NavLeft>

      <NavCenter>
        <NavLinks>
          {navigationItems.map((item) => (
            <NavLink
              key={item.id}
              active={activePage === item.id}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>
      </NavCenter>

      <NavRight>
        {showSearch && (
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search accounts, managers, etc..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <SearchButton type="submit">
              🔍
            </SearchButton>
          </SearchForm>
        )}

        <UserProfile>
          <ProfileDropdown>
            <ProfileButton>
              <ProfileAvatar>
                <span>JD</span>
              </ProfileAvatar>
              <ProfileName>John Doe</ProfileName>
              <DropdownArrow>▼</DropdownArrow>
            </ProfileButton>
            <DropdownMenu>
              <DropdownItem onClick={() => handleProfileAction('settings')}>
                ⚙️ Settings
              </DropdownItem>
              <DropdownItem onClick={() => handleProfileAction('logout')}>
                🚪 Logout
              </DropdownItem>
            </DropdownMenu>
          </ProfileDropdown>
        </UserProfile>
      </NavRight>
    </NavigationBar>
  );
};

// Styled Components
const NavigationBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 100px;
  background: ${colors.surface};
  border-bottom: 2px solid ${colors.border};
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 20px ${colors.shadow};
  width: 100vw;
  max-width: 100vw;
  @media (max-width: 768px) {
    padding: 0 12px;
    height: 80px;
  }
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-width: 0;
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px 32px;
  justify-content: center;
  align-items: center;
  width: auto;
  max-width: 100vw;
  overflow-x: visible;
  row-gap: 16px;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LogoText = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.primary};
`;

const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${props => props.active ? colors.primary : colors.text};
  cursor: pointer;
  padding: 18px 28px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
  &:hover {
    color: ${colors.primary};
    background: ${colors.accent5};
  }
  ${props => props.active && `
    background: ${colors.accent5};
    color: ${colors.primary};
    box-shadow: 0 2px 8px ${colors.shadow};
  `}
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  border-radius: 12px;
  padding: 8px 16px;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 200px;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: none;
  font-size: 14px;
  color: ${colors.text};
  flex: 1;
  outline: none;

  &::placeholder {
    color: ${colors.textLight};
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
  color: ${colors.primary};

  &:hover {
    background: ${colors.accent5};
  }
`;

const UserProfile = styled.div`
  position: relative;
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${colors.primary};
  color: ${colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${colors.text};

  @media (max-width: 768px) {
    display: none;
  }
`;

const DropdownArrow = styled.span`
  font-size: 12px;
  color: ${colors.primary};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  border-radius: 12px;
  box-shadow: 0 10px 25px ${colors.shadow};
  min-width: 160px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;

  ${ProfileDropdown}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: ${colors.text};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: ${colors.accent5};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

export default Header; 