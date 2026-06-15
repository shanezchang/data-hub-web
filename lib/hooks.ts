"use client";
import useSWR from "swr";
import { api } from "./api";

export type Me = { email: string; name: string | null };
export type ApiKeyRow = {
  id: number;
  name: string;
  key_prefix: string;
  scopes: string[];
  rate_limit_per_min: number;
  daily_quota: number | null;
  revoked: boolean;
};
export type RequestRow = {
  ts: string;
  key_id: number;
  key_name: string;
  method: string;
  path: string;
  query: string | null;
  body: string | null;
  status: number;
  duration_ms: number;
};
export type RequestLog = { total: number; items: RequestRow[] };
export type Usage = {
  total: number;
  today: number;
  daily: { date: string; count: number }[];
  by_key: { name: string; count: number }[];
};

const authFetcher = <T,>(path: string) => api<T>(path, { auth: true });

export const useMe = () => useSWR<Me>("/portal/me", authFetcher<Me>);
export const useKeys = () => useSWR<ApiKeyRow[]>("/portal/keys", authFetcher<ApiKeyRow[]>);
export const useUsage = () => useSWR<Usage>("/portal/usage?days=30", authFetcher<Usage>);
export const useRequests = () => useSWR<RequestLog>("/portal/requests?limit=50", authFetcher<RequestLog>);
