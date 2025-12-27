import { gql } from "@apollo/client";

export const CREATE_WORKSPACE = gql`
  mutation CreateWorkspace($name: String!) {
    createWorkspace(name: $name) {
      id
      name
      OwnerID
    }
  }
`;
