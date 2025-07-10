import styled from 'styled-components';
import colors from '../assets/colors';

const DashboardCard = styled.div`
  background: ${colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px ${colors.shadow};
  border: 2px solid ${colors.border};
  transition: all 0.3s ease;
  color: ${colors.text};
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${colors.shadow};
    border-color: ${colors.accent3};
  }
`;

export default DashboardCard; 