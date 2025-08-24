import { create } from "zustand";
import api from "../axios";
import type { MovieDetail, TVDetail } from "../types/content";

export interface MovieContentType {
  adult: boolean;
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string; // ISO date string
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TVContentType {
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: "tv";
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string; // ISO date string (e.g. "2025-08-12")
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

type ContentType = "movie" | "tv";



interface ContentState {
    movieDetail:MovieDetail ,
    tvDetail:TVDetail ,
  movie: {
    page: number;
    data: MovieContentType[];
  };
  tv: {
    page: number;
    data: TVContentType[];
  };
  fetchContent: (contentType: ContentType) => Promise<void>;
  fetchContentDetail: (contentType: ContentType,id:string) => Promise<void>;
}



export const useContentStore = create<ContentState>((set, get) => ({
    movieDetail:{} as MovieDetail,
    tvDetail:{} as TVDetail,
  movie: {
    page: 1,
    data: [],
  },
  tv: {
    page: 1,
    data: [],
  },
  fetchContent: async (contentType = "movie") => {
    let state = get();
    try {
      let res = await api.get(
        `content/get-all/${state[contentType].page}?content=${contentType}`
      );
      if (res.data.success) {
     
        set({
          [contentType]: {
            page: state[contentType].page + 1,
            data: [...state[contentType].data, ...res.data.data],
          },
        });
      }
    } catch (error) {}
  },
  fetchContentDetail: async (contentType,id) => {
    try {
        let res = await api.get(`content/get-detail/${id}?content=${contentType}`)
        if(res.data.success){

            set({[`${contentType}Detail`]:res.data.data})
        }
    } catch (error) {
        
    }
  }
  //   setToken: (token) => set({ accessToken: token }),
}));
