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
  type: "lobby" | "info" | "game";
  method:
    | "create"
    | "join"
    | "leave"
    | "info"
    | "start"
    | "stop"
    | "unveil"
    | "lobby";
  body: { code: string } | { code: string; player: string; role: string };
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
  type: "lobby" | "info" | "game";
  method:
    | "create"
    | "join"
    | "leave"
    | "info"
    | "start"
    | "stop"
    | "unveil"
    | "lobby";
  message?: string;
  body:
    | { code: string }
    | { code: string; players: string[] }
    | {
        code: string;
        running: boolean;
        role: string;
        card?: string;
        live?: boolean;
      }
    | { player: string; role: string }
    | { code: string; role: string };
};

// Player structure used in the "info" response body
export type Player = {
  name: string;
  role?: string;
  alive?: boolean;
};

export { Request, Response };
