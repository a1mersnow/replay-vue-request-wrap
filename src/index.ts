import { usePagination } from 'vue-request';
import { IService } from 'vue-request/dist/types/core/utils/types';

type ServerResponse<T = any, Extra = {}> = {
  msg?: string;
  code: number;
  data: T;
} & Extra;

type ServerPageResponse<Row = unknown> = ServerResponse<{
  total: number;
  rows: Row[];
}>;

function usePage<R extends ServerPageResponse, P extends unknown[]>(
  service: IService<R, P>
) {
  return usePagination(service, {
    formatResult: (res) =>
      res.code === 201 ? res.data : { total: 0, rows: [] },
    pagination: {
      currentKey: 'pageNum',
    },
    defaultParams: [
      {
        pageSize: 20,
        pageNum: 1,
      },
    ] as P,
  });
}

export type Params = Record<string, string | number | void>;

export interface PageParams extends Params {
  pageSize?: number;
  pageNum?: number;
}

export interface ListNoticeParams extends PageParams {
  district?: string;
  title?: string;
}

interface Notice {
  ID: string;
  TITLE: string;
  ISTOP: string;
  DISTRICT: string;
  NTYPE: string;
  NTIME2: string; // 公告日期
  NFILEID: string;
  ATTACH: string;
}

function listNotice(userParams: ListNoticeParams) {
  return {} as Promise<ServerPageResponse<Notice>>;
}

// this is not ok
{
  const { data, loading, current, pageSize, error, run, total } =
    usePage(listNotice);
}

// but this is ok
{
  const { data, loading, current, pageSize, error, run, total } =
    usePagination(listNotice, {
      formatResult: (res) =>
        res.code === 201 ? res.data : { total: 0, rows: [] },
      pagination: {
        currentKey: 'pageNum',
      },
      defaultParams: [
        {
          pageSize: 20,
          pageNum: 1,
        },
      ],
    })
}
