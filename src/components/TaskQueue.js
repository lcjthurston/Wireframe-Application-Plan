import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Header from './Header';
import colors from '../assets/colors';

const TaskQueue = ({ onLogout, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortField, setSortField] = useState('dateCreated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Mock data for tasks
  const allTasks = [
    {
      id: 1,
      accountName: 'ABC Corporation',
      taskType: 'Super Flag',
      dateCreated: '2024-01-15',
      assignedTo: 'John Doe',
      priority: 'high',
      description: 'Contract requires immediate attention due to pricing discrepancies'
    },
    {
      id: 2,
      accountName: 'XYZ Industries',
      taskType: 'Provider Selection',
      dateCreated: '2024-01-14',
      assignedTo: 'Unassigned',
      priority: 'medium',
      description: 'Need to select new provider for upcoming contract renewal'
    },
    {
      id: 3,
      accountName: 'Main Street Plaza',
      taskType: 'New Account Verification',
      dateCreated: '2024-01-13',
      assignedTo: 'Sarah Johnson',
      priority: 'low',
      description: 'New account created from email, requires verification'
    },
    {
      id: 4,
      accountName: 'Downtown Center',
      taskType: 'Super Flag',
      dateCreated: '2024-01-12',
      assignedTo: 'Mike Chen',
      priority: 'high',
      description: 'Contract terms need review and approval'
    },
    {
      id: 5,
      accountName: 'Tech Park LLC',
      taskType: 'Provider Selection',
      dateCreated: '2024-01-11',
      assignedTo: 'Unassigned',
      priority: 'medium',
      description: 'Provider selection needed for new service agreement'
    },
    {
      id: 6,
      accountName: 'Industrial Complex',
      taskType: 'New Account Verification',
      dateCreated: '2024-01-10',
      assignedTo: 'Unassigned',
      priority: 'low',
      description: 'Account verification pending documentation review'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All Tasks', count: allTasks.length },
    { id: 'super-flagged', label: 'Super Flagged Contracts', count: allTasks.filter(t => t.taskType === 'Super Flag').length },
    { id: 'provider-selection', label: 'Needs Provider Selection', count: allTasks.filter(t => t.taskType === 'Provider Selection').length },
    { id: 'verification', label: 'New Account Verification', count: allTasks.filter(t => t.taskType === 'New Account Verification').length }
  ];

  const getFilteredTasks = () => {
    let filtered = allTasks;

    // Filter by active tab
    if (activeTab !== 'all') {
      const taskTypeMap = {
        'super-flagged': 'Super Flag',
        'provider-selection': 'Provider Selection',
        'verification': 'New Account Verification'
      };
      filtered = filtered.filter(task => task.taskType === taskTypeMap[activeTab]);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'dateCreated') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAssignToMe = (taskId) => {
    console.log('Assigning task', taskId, 'to current user');
    // TODO: Implement assignment logic
  };

  const handleGoToAccount = (accountName) => {
    console.log('Navigating to account:', accountName);
    // TODO: Implement navigation to account dashboard
  };

  const handleNavigation = (page) => {
    console.log('Navigating to:', page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    if (action === 'logout') {
      onLogout();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // TODO: Implement search functionality
  };

  const filteredTasks = getFilteredTasks();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <PageContainer>
      {/* Dynamic Background Layers */}
      <BackgroundGradient />
      <BackgroundPattern />
      <FloatingShapes />
      
      {/* Top Navigation Bar */}
      <Header
        activePage="task-queue"
        onNavigate={handleNavigation}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {/* Main Content */}
      <MainContainer>
        <PageHeader>
          <PageTitle>Master Task & Action Queue</PageTitle>
          <PageSubtitle>Central hub for all tasks requiring manual intervention</PageSubtitle>
        </PageHeader>

        {/* Tabbed Interface */}
        <TabContainer>
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <TabCount>{tab.count}</TabCount>
            </TabButton>
          ))}
        </TabContainer>

        {/* Task Table */}
        <TableContainer>
          <TaskTable>
            <TableHeader>
              <TableRow>
                <TableHeaderCell onClick={() => handleSort('accountName')}>
                  Account Name {sortField === 'accountName' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('taskType')}>
                  Task Type {sortField === 'taskType' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('dateCreated')}>
                  Date Created {sortField === 'dateCreated' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </TableHeaderCell>
                <TableHeaderCell onClick={() => handleSort('assignedTo')}>
                  Assigned To {sortField === 'assignedTo' ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>
                    <AccountLink onClick={() => handleGoToAccount(task.accountName)}>
                      {task.accountName}
                    </AccountLink>
                  </TableCell>
                  <TableCell>
                    <TaskTypeBadge priority={task.priority}>
                      {task.taskType}
                    </TaskTypeBadge>
                  </TableCell>
                  <TableCell>
                    {new Date(task.dateCreated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AssigneeCell>
                      {task.assignedTo === 'Unassigned' ? (
                        <UnassignedBadge>Unassigned</UnassignedBadge>
                      ) : (
                        task.assignedTo
                      )}
                    </AssigneeCell>
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      {task.assignedTo === 'Unassigned' && (
                        <ActionButton onClick={() => handleAssignToMe(task.id)}>
                          Assign to Me
                        </ActionButton>
                      )}
                      <ActionButton onClick={() => handleGoToAccount(task.accountName)}>
                        Go to Account
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TaskTable>
        </TableContainer>

        {filteredTasks.length === 0 && (
          <EmptyState>
            <EmptyIcon>📋</EmptyIcon>
            <EmptyTitle>No tasks found</EmptyTitle>
            <EmptyMessage>
              {searchQuery ? 'Try adjusting your search criteria.' : 'All caught up! No tasks require attention.'}
            </EmptyMessage>
          </EmptyState>
        )}
      </MainContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${colors.background};
`;

const BackgroundGradient = styled.div`
  display: none;
`;

const BackgroundPattern = styled.div`
  display: none;
`;

const FloatingShapes = styled.div`
  display: none;
`;

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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

const MainContainer = styled.div`
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 3;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.text};
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: ${colors.textLight};
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: ${colors.accent5};
  border-radius: 12px;
  padding: 8px;
  border: 2px solid ${colors.border};

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const TabButton = styled.button`
  background: ${props => props.active ? colors.primary : 'transparent'};
  border: none;
  color: ${props => props.active ? colors.background : colors.text};
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${colors.surfaceHover};
    color: ${colors.primary};
  }

  ${props => props.active && `
    box-shadow: 0 2px 8px ${colors.shadow};
  `}
`;

const TabCount = styled.span`
  background: ${colors.primary};
  color: ${colors.background};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const TableContainer = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  border: 2px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 8px 32px ${colors.shadow};
`;

const TaskTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${colors.accent5};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.accent6};
  transition: background-color 0.2s ease;
  display: table-row;

  &:hover {
    background: ${colors.surfaceHover};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text};
  cursor: pointer;
  transition: all 0.2s ease;
  display: table-cell;
  vertical-align: middle;

  &:hover {
    background: ${colors.surfaceHover};
  }
`;



const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${colors.text};
  vertical-align: middle;
  display: table-cell;
`;

const AccountLink = styled.button`
  background: none;
  border: none;
  color: #fbbf24;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #f59e0b;
    text-decoration: underline;
  }
`;

const TaskTypeBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
    switch (props.priority) {
      case 'high': return 'rgba(239, 68, 68, 0.2)';
      case 'medium': return 'rgba(245, 158, 11, 0.2)';
      case 'low': return 'rgba(34, 197, 94, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.priority) {
      case 'high': return '#fca5a5';
      case 'medium': return '#fcd34d';
      case 'low': return '#86efac';
      default: return '#d1d5db';
    }
  }};
  border: 1px solid ${props => {
    switch (props.priority) {
      case 'high': return 'rgba(239, 68, 68, 0.3)';
      case 'medium': return 'rgba(245, 158, 11, 0.3)';
      case 'low': return 'rgba(34, 197, 94, 0.3)';
      default: return 'rgba(107, 114, 128, 0.3)';
    }
  }};
`;

const AssigneeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UnassignedBadge = styled.span`
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid rgba(107, 114, 128, 0.3);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  color: ${colors.text};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.surfaceHover};
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 64px 32px;
  color: ${colors.text};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${colors.text};
`;

const EmptyMessage = styled.p`
  font-size: 14px;
  color: ${colors.textLight};
  margin: 0;
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
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.primary};
`;

const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  font-weight: 500;
  color: ${props => props.active ? colors.background : colors.textLight};
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
    background: ${colors.primary};
    color: ${colors.background};
    box-shadow: 0 2px 8px ${colors.shadow};
  `}
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MoreOptionsButton = styled(NavLink)`
  padding-right: 36px;
  &::after {
    content: '';
    display: inline-block;
    margin-left: 8px;
  }
`;

const NavDropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: ${colors.surface};
  border: 2px solid ${colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 16px ${colors.shadow};
  min-width: 180px;
  z-index: 1000;
  padding: 8px 0;
`;

const NavDropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: ${colors.text};
  font-size: 1.1rem;
  text-align: left;
  padding: 12px 24px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: ${colors.accent5};
    color: ${colors.primary};
  }
`;

export default TaskQueue; 