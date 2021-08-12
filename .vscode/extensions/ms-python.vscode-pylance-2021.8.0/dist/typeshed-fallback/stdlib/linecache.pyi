from typing import Any, Dict, List, Protocol, Tuple

_ModuleGlobals = Dict[str, Any]
_ModuleMetadata = Tuple[int, float, List[str], str]

class _SourceLoader(Protocol):
    def __call__(self) -> str | None: ...

cache: Dict[str, _SourceLoader | _ModuleMetadata]

def getline(filename: str, lineno: int, module_globals: _ModuleGlobals | None = ...) -> str: ...
def clearcache() -> None: ...
def getlines(filename: str, module_globals: _ModuleGlobals | None = ...) -> List[str]: ...
def checkcache(filename: str | None = ...) -> None: ...
def updatecache(filename: str, module_globals: _ModuleGlobals | None = ...) -> List[str]: ...
def lazycache(filename: str, module_globals: _ModuleGlobals) -> bool: ...