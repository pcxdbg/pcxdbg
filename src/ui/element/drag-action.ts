
/**
 * User interface drag action type
 */
const enum UIDragActionType {
    COPY,
    LINK,
    MOVE
}

/**
 * User interface drag action
 */
interface UIDragAction<T> {
    type: UIDragActionType;
    data?: T;
    completion?: (type: UIDragActionType) => void;
}

export {
    UIDragActionType,
    UIDragAction
};
