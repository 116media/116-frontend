import axios from "axios";
import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
import type { IRevokeSessionResponse } from "@/modules/session/domain/entities/IRevokeSessionResponse";
import type { ISessionEntity } from "@/modules/session/domain/entities/ISessionEntity";
import { SessionMapper } from "@/modules/session/infrastructure/mappers/session.mapper";
import { err, ok, type Result } from "@/shared/domain/results/result";
import type { Api } from "@/shared/infrastructure/api/generated/116.api";
import { API_URL, CLIENT_APP } from "@/shared/infrastructure/constants/common";
import { ProblemMapper } from "@/shared/infrastructure/mappers/problem.mapper";

/**
 * A bare axios client with NO interceptors, used only to refresh tokens. Sending the
 * refresh request through the interceptor-bearing client would recurse on 401.
 */
const refreshClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Client-App": CLIENT_APP }
});

/**
 * SessionRepositoryImpl
 *
 * @description
 * Implements session refresh (bare client) plus the sessions list/revoke (via the
 * normal injected client). Refresh rotates the cookies server-side; nothing is
 * stored client-side.
 */
export class SessionRepositoryImpl implements ISessionRepositoryPort {
    private readonly api: Api<unknown>["api"];

    constructor({ client }: { client: Api<unknown> }) {
        this.api = client.api;
    }

    async refreshToken(): Promise<void> {
        // No try/catch and no Result wrapper — a failed refresh must reject so the
        // expiry interceptor can fall through to the session-expired event.
        await refreshClient.post("/api/v1/public/sessions/refresh-token");
    }

    async getSessions(isActive?: boolean): Promise<Result<ISessionEntity[]>> {
        try {
            const response = await this.api.publicGetOwnSessions({ isActive });
            return ok(SessionMapper.sessionListFromDto(response.data.sessions));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async revokeSession(id: string): Promise<Result<IRevokeSessionResponse>> {
        try {
            const response = await this.api.publicRevokeSession(id);
            return ok(SessionMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
