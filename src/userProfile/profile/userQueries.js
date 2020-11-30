import { useQuery } from '@apollo/react-hooks';
import { TEAM_MEMBERS_QUERY } from './gql';

export const useTeamMembersQuery = () => useQuery(TEAM_MEMBERS_QUERY);
