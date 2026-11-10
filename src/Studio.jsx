import { useLayoutEffect, useRef } from 'react';
import { StudioHeader } from './StudioHeader';
import { Workspace } from './Workspace';
import { mountStudio } from './studioEngine';

export default function Studio() {
  const root = useRef(null);
  useLayoutEffect(() => mountStudio(root.current), []);

  return (
    <div className="contents" ref={root}>
      <StudioHeader />
      <Workspace />
      <canvas id="renderCanvas" width="5664" height="2500" className="hidden" />
    </div>
  );
}
