import { ENDPOINTS, publicClient } from "@/shared/services";

export type RawCourse = any;
export type RawInstructor = any;

export const courseService = {
  async getCourses(page = 1, limit = 20) {
    return publicClient.get<{ data: RawCourse[] }>(
      `${ENDPOINTS.COURSE.COURSE_DETAILS}?page=${page}&limit=${limit}`,
    );
  },

  async getInstructors(page = 1, limit = 20) {
    return publicClient.get<{ data: RawInstructor[] }>(
      `${ENDPOINTS.COURSE.COURSE_LIST}?page=${page}&limit=${limit}`,
    );
  },
};
