import { useState, useCallback } from "react";
import { getMatchedPeers } from "../firebase/matchingService";

/* ---------------- TYPES ---------------- */

export interface MatchedPeer {
  id: string;
  name: string;
  avatar?: string;
  interests?: string[];
  matchScore?: number;
}

/* ---------------- HOOK ---------------- */

export function useMatching() {
  const [matches, setMatches] = useState<MatchedPeer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Find matching peers for a given user
   * @param userId - Current user ID
   * @param limit - Max number of matches
   */
  const findMatches = useCallback(
    async (userId: string, limit: number = 10): Promise<MatchedPeer[]> => {
      if (!userId) {
        const msg = "User ID is required to find matches";
        setError(msg);
        throw new Error(msg);
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getMatchedPeers(userId, limit);

        if (!Array.isArray(result)) {
          throw new Error("Invalid match data received");
        }

        setMatches(result);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch matches";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Clear current matches and errors */
  const clearMatches = useCallback(() => {
    setMatches([]);
    setError(null);
  }, []);

  return {
    matches,
    loading,
    error,
    findMatches,
    clearMatches,
  };
}
