from typing import Dict, Any
from dataclasses import dataclass, asdict
from enum import Enum


class MessageType(str, Enum):
    CONNECTED = "connected"
    PROGRESS = "progress"
    CHUNK = "chunk"
    COMPLETE = "complete"
    ERROR = "error"


@dataclass
class ConnectedMessage:
    type: str = MessageType.CONNECTED.value
    job_id: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ProgressMessage:
    status: str
    progress: int
    message: str
    type: str = MessageType.PROGRESS.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ChunkMessage:
    timestamp: float
    segment: Dict[str, Any]
    type: str = MessageType.CHUNK.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class CompleteMessage:
    analysis: Dict[str, Any]
    type: str = MessageType.COMPLETE.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ErrorMessage:
    code: str
    message: str
    type: str = MessageType.ERROR.value

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
