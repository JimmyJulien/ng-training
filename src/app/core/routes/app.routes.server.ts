import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // {
  //   path: appRoutePaths.LOGIN,
  //   renderMode: RenderMode.Server,
  // },
  // {
  //   path: appRoutePaths.HOME,
  //   renderMode: RenderMode.Prerender,
  // },
  // {
  //   path: appRoutePaths.USER,
  //   renderMode: RenderMode.Client,
  // },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
