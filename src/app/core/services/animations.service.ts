import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {
    public animationStates: any;
    public visibilityStates: any;

  constructor() {
      this.animationStates = {
          expandCollapse: 'expanded',
          fadeIn        : {
              direction: 'in',
              in       : '*',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          fadeOut       : {
              direction: 'out',
              out      : '*',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          shake         : {
              shake: true
          },
          slideIn       : {
              direction: 'top',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          slideOut      : {
              direction: 'top',
              top      : '*',
              bottom   : '*',
              left     : '*',
              right    : '*'
          },
          zoomIn        : {
              in: '*'
          },
          zoomOut       : {
              out: '*'
          }
      };
      this.visibilityStates = {
          expandCollapse: true,
          fadeIn        : {
              in    : true,
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          fadeOut       : {
              out   : true,
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          shake         : {
              shake: true
          },
          slideIn       : {
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          slideOut      : {
              top   : true,
              bottom: true,
              left  : true,
              right : true
          },
          zoomIn        : {
              in: true
          },
          zoomOut       : {
              out: true
          }
      };
  }
}
