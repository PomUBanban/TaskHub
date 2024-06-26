declare module "react-trello" {
  export interface Card {
    id: string;
    title: string;
    description: string;
    label?: string;
    metadata?: any;
    draggable?: boolean;
    laneId?: string;
  }

  export interface Lane {
    id: string;
    title: string;
    label?: string;
    cards: Card[];
    collapsible?: boolean;
    droppable?: boolean;
    draggable?: boolean;
    onCardClick?: (cardId: string, metadata: any, laneId: string) => void;
    onCardAdd?: (card: Card, laneId: string) => void;
    onCardDelete?: (cardId: string, laneId: string) => void;
    onCardMoveAcrossLanes?: (
      fromLaneId: string,
      toLaneId: string,
      cardId: string,
      index: number,
    ) => void;
  }

  export interface BoardData {
    lanes: Lane[];
  }

  interface BoardProps {
    data: BoardData;
    draggable?: boolean;
    laneDraggable?: boolean;
    cardDraggable?: boolean;
    collapsibleLanes?: boolean;
    editable?: boolean;
    canAddLanes?: boolean;
    hideCardDeleteIcon?: boolean;
    customCardLayout?: boolean;
    onLaneClick?: (laneId: string) => void;
    onCardClick?: (cardId: string, metadata: any, laneId: string) => void;
    onCardAdd?: (card: Card, laneId: string) => void;
    onCardDelete?: (cardId: string, laneId: string) => void;
    onCardMoveAcrossLanes?: (
      fromLaneId: string,
      toLaneId: string,
      cardId: string,
      index: number,
    ) => void;
    onLaneAdd?: (params: any) => void;
    onLaneDelete?: (laneId: string) => void;
    onLaneUpdate?: (laneId: string, data: any) => void;
    onLaneDragStart?: (laneId: string) => void;
    onLaneDragEnd?: (laneId: string, newPosition: number) => void;
    onCardDragStart?: (cardId: string, laneId: string) => void;
    onCardDragEnd?: (
      cardId: string,
      sourceLaneId: string,
      targetLaneId: string,
      position: number,
      cardDetails: Card,
    ) => void;
    handleDragStart?: (cardId: string, laneId: string) => void;
    handleDragEnd?: (
      cardId: string,
      sourceLaneId: string,
      targetLaneId: string,
      position: number,
      cardDetails: Card,
    ) => void;
    onDataChange?: (newData: BoardData) => void;
    shouldReceiveNewData?: (nextData: any) => void;
    eventBusHandle?: (any) => void;
    components?: any;
  }

  const Board: React.FC<BoardProps>;
  export default Board;
}
