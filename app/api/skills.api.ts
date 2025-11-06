import { httpClient } from "./http-client";
import { ResponseDto } from "@/app/types/response.type";

export interface Skill {
  id: string;
  name: string;
  description?: string;
  synonyms: string[];
  status: "ACTIVE" | "SUGGESTED" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface SuggestSkillDto {
  name: string;
}

const base = "/skills" as const;

export async function getSkills(query?: string): Promise<Skill[]> {
  const { data } = await httpClient.get<ResponseDto<Skill[]>>(base, {
    params: query ? { q: query } : undefined,
  });
  return data.data;
}

export async function suggestSkill(dto: SuggestSkillDto): Promise<Skill> {
  const { data } = await httpClient.post<ResponseDto<Skill>>(
    `${base}/suggest`,
    dto
  );
  return data.data;
}

export default {
  getSkills,
  suggestSkill,
};
