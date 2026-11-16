import '@videojs/html/video/player';
import '@videojs/html/video/ui';
import '@videojs/html/media/hlsjs-video';
import {
  registerIcons,
  playIcon, pauseIcon, restartIcon, seekIcon,
  volumeOffIcon, volumeLowIcon, volumeHighIcon,
  fullscreenEnterIcon, fullscreenExitIcon,
  pipEnterIcon, pipExitIcon, speedIcon, captionsOnIcon, captionsOffIcon,
} from '@videojs/html/icons';

registerIcons('default', {
  play: playIcon,
  pause: pauseIcon,
  restart: restartIcon,
  seek: seekIcon,
  'volume-off': volumeOffIcon,
  'volume-low': volumeLowIcon,
  'volume-high': volumeHighIcon,
  'fullscreen-enter': fullscreenEnterIcon,
  'fullscreen-exit': fullscreenExitIcon,
  'pip-enter': pipEnterIcon,
  'pip-exit': pipExitIcon,
  speed: speedIcon,
  'captions-on': captionsOnIcon,
  'captions-off': captionsOffIcon,
});























