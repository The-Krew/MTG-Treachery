/*
 * Request structure
 * {
 * "type": "lobby" | "info" | "game"
 * "method": <-
 * 		(lobby) "create" | "join" | "leave"
 * 		(info) "info"
 * 		(game) "start" | "stop" | "unveil" | "lobby"
 * "body": {
 * 	"code": <string>
 * 	(unveil) - "player": <string>
 * 		 - "role": <char>
 * }
 */

type Request = {
  type: "lobby" | "info" | "game" | "ping";
  method:
    | "create"
    | "join"
    | "leave"
    | "info"
    | "start"
    | "stop"
    | "unveil"
    | "lobby"
    | "heartbeat"
    | "state";
  body:
    | { code: string }
    | { code: string; player: string; role: string }
    | { code: string; rarity: string };
};

/*
 * Response structure
 * {
 * "type": "lobby" | "info" | "game"
 * "method": <-
 * 		(lobby) "create" | "join" | "leave"
 * 		(info) "info"
 * 		(game) "start" | "stop" | "unveil" | "lobby"
 * "message": "" || <string> // Optional error message
 * "body": {} || "method" != "error" : {
 * 			(lobby) "code": <string>
 * 			(info) "players": std::vector<Player>
 * 			(game)
 * 			 \start | "stop"
 * 			 - "code": <string>
 * 			 - "running": <boolean>
 * 			 -- single player actions --
 * 			 - "role": <char>
 * 			 - "card": ? To be added
 * 			 - "live": <boolean> ? To be added
 * 			 \unveil
 * 			 - "player": <string>
 * 			 - "role": <string>
 * 			 \lobby
 * 			 - "code": <string>
 * 			 - "role": <int> | -1 for NONE
 * 			 }
 * }
 */

type Response = {
  type: "lobby" | "info" | "game" | "pong";
  method:
    | "create"
    | "join"
    | "leave"
    | "info"
    | "start"
    | "stop"
    | "unveil"
    | "lobby"
    | "heaertbeat"
    | "state";
  message?: string;
  body: LobbyBody | InfoBody | StartGameBody | StopGameBody | UnveilBody | {};
};

// Bodies for specific responses
export type LobbyBody = { code: string };
export type InfoPreParsed = { code: string; players: string[] };
export type InfoBody = { code: string; players: Player[] };
export type StartGameBody = {
  code: string;
  running: boolean;
  role: string;
  card: Card;
};
export type StopGameBody = { code: string; running: boolean; role: string };
export type UnveilBody = { player: Player; role: string };

export type StateBody = {
  code: string;
  running: boolean;
  role: string;
  card: Card;
  players: string[];
  unveiled: boolean;
};

// Player structure used in the "info" response body
export type Player = {
  name: string;
  role: string;
  alive?: boolean;
};

export type Card = {
  id: number;
  name: string;
  roleid: number;
  rolename: string;
  rarity: string;
  text: string;
  rulings: string[];
  url: string;
  role_url: string;
};

export const DefaultCard: Card = {
  id: -1,
  name: "",
  text: "",
  rulings: [],
  roleid: -1,
  rolename: "",
  rarity: "",
  url: "",
  role_url: "",
};

export { Request, Response };
