import { NextResponse, NextRequest } from 'next/server';
import parse from 'url-parse';

// https://www.retrospected.com/?campaignid=19686942887&creative=648178043912&device=c&keyword=retro

const COOKIE_NAME = 'retro-aw-tracking';

export type TrackingInfo = {
  campaignId: string;
  creativeId: string;
  device: string;
  keyword: string;
  gclid: string;
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const url = parse(request.url, true);

  if (url.query && url.query.campaignid && url.query.creative) {
    const tracking: Partial<TrackingInfo> = {
      campaignId: url.query.campaignid,
      creativeId: url.query.creative,
      device: url.query.device,
      keyword: url.query.keyword,
      gclid: url.query.gclid,
    };

    response.cookies.set({
      name: COOKIE_NAME,
      value: JSON.stringify(tracking),
      sameSite: 'lax',
    });
  }

  return response;
}
