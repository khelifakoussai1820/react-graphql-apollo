import { gql } from "@apollo/client";


export const CREATE_BLOCK = gql`
  mutation CreateBlock(
    $pageId: String!
    $parentblockId: String
    $type: BlockTypeEnum!
    $order: Int
    $data: JSON
  ) {
    createBlock(
      pageId: $pageId
      parentblockId: $parentblockId
      type: $type
      order: $order
      data: $data
    ) {
      id
      pageId
      parentblockId
      Type
      data
    }
  }
`;


export const UPDATE_BLOCK = gql`
  mutation UpdateBlock(
    $id: String!
    $type: BlockTypeEnum!
    $data: JSON
  ) {
    updateBlock(
      id: $id
      type: $type
      data: $data
    ) {
      id
      Type
      data
    }
  }
`;


export const MOVE_BLOCK = gql`
  mutation MoveBlock(
    $id: String!
    $pageId: String!
    $parentblockId: String
    $order: Int!
  ) {
    moveBlock(
      id: $id
      pageId: $pageId
      parentblockId: $parentblockId
      order: $order
    ) {
      id
      pageId
      parentblockId
      Type
      data
    }
  }
`;


export const DELETE_BLOCK_TREE = gql`
  mutation DeleteBlockTree($id: String!) {
    deleteBlockTree(id: $id)
  }
`;
