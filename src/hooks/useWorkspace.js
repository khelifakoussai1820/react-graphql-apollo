import { useQuery, useMutation } from '@apollo/client';
import {
  GET_WORKSPACES,
  GET_PAGES
} from '../graphql/queries';
import {
  CREATE_WORKSPACE,
  CREATE_PAGE,
  UPDATE_WORKSPACE,
  UPDATE_PAGE,
  DELETE_WORKSPACE,
  DELETE_PAGE
} from '../graphql/mutations';

export default function useWorkspace() {
  const { data, loading, refetch } = useQuery(GET_WORKSPACES);

  const [createWorkspace] = useMutation(CREATE_WORKSPACE);
  const [createPage] = useMutation(CREATE_PAGE);
  const [updateWorkspace] = useMutation(UPDATE_WORKSPACE);
  const [updatePage] = useMutation(UPDATE_PAGE);
  const [deleteWorkspace] = useMutation(DELETE_WORKSPACE);
  const [deletePage] = useMutation(DELETE_PAGE);

  return {
    loading,
    workspaces: data?.workspaces ?? [],

    addWorkspace: async () => {
      await createWorkspace({ variables: { name: 'New Workspace' } });
      refetch();
    },

    addPage: async (workspaceId) => {
      await createPage({
        variables: { workspaceId, name: 'New Page' }
      });
      refetch();
    },

    renameItem: async (type, id, workspaceId, name) => {
      if (type === 'workspace') {
        await updateWorkspace({ variables: { id, name } });
      } else {
        await updatePage({ variables: { id, name } });
      }
      refetch();
    },

    deleteItem: async (type, id) => {
      if (type === 'workspace') {
        await deleteWorkspace({ variables: { id } });
      } else {
        await deletePage({ variables: { id } });
      }
      refetch();
    }
  };
}
