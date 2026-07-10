import axios from "axios";

import type { IRevokeSessionResponse } from "@/modules/auth/domain/entities/IRevokeSessionResponse";
import type { ISession } from "@/modules/auth/domain/entities/ISession";
import { AuthMapper } from "@/modules/auth/infrastructure/mappers/auth.mapper";
import type { ISessionRepositoryPort } from "@/modules/session/application/repositories/session.repository.port";
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

    async getSessions(isActive?: boolean): Promise<Result<ISession[]>> {
        try {
            const response = await this.api.publicGetOwnSessions({ isActive });
            return ok(AuthMapper.sessionListFromDto(response.data.sessions));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }

    async revokeSession(id: string): Promise<Result<IRevokeSessionResponse>> {
        try {
            const response = await this.api.publicRevokeSession(id);
            return ok(AuthMapper.actionFromDto(response.data));
        } catch (error) {
            return err(ProblemMapper.toFailure(error));
        }
    }
}
