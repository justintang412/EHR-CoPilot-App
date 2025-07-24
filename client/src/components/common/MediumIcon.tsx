import SvgIcon from '@mui/material/SvgIcon';
import type { SvgIconProps } from '@mui/material/SvgIcon';

export default function MediumIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="16" fill="currentColor" />
      <path
        d="M9.5 11.5c.1-.2 0-.4-.2-.5l-1.2-1.5V9h4.1l3.2 7.1 2.8-7.1h3.9v.2l-1 1c-.1.1-.2.2-.2.3v9.2c0 .1 0 .2.1.3l1 1v.2h-5.5v-.2l1-1c.1-.1.1-.2.1-.3v-7.4l-3.2 8.1h-.4l-3.7-8.1v6.7c0 .2 0 .3.1.4l1.3 1.6v.2H7v-.2l1.3-1.6c.1-.1.1-.2.1-.4v-7.2z"
        fill="#fff"
      />
      <path
        d="M20.5 16c0-1 .8-1.5 1.7-1.5.4 0 .8.1 1.1.2v1.1c-.2-.1-.5-.2-.8-.2-.5 0-.8.2-.8.6 0 .4.3.6.8.6.3 0 .6-.1.8-.2v1.1c-.3.1-.7.2-1.1.2-1 0-1.7-.5-1.7-1.5z"
        fill="#fff"
      />
    </SvgIcon>
  );
}