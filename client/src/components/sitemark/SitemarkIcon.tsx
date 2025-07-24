import SvgIcon from '@mui/material/SvgIcon';

export default function SitemarkIcon() {
  return (
    <SvgIcon sx={{ height: 21, width: 100, mr: 2 }}>
      <svg
        width={100}
        height={21}
        viewBox="0 0 100 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="'Segoe UI', 'Arial', sans-serif"
          fontWeight="bold"
          fontSize="14"
          fill="#4876EE"
        >
          <tspan fontSize="18" fill="#4876EE">E</tspan>
          <tspan fontSize="14" fill="#4876EE">HR{' '}</tspan>
          <tspan fontSize="18" fill="#00D3AB">C</tspan>
          <tspan fontSize="14" fill="#00D3AB">O</tspan>
          <tspan fontSize="18" fill="#00D3AB">P</tspan>
          <tspan fontSize="14" fill="#00D3AB">IOLT</tspan>
        </text>
      </svg>
    </SvgIcon>
  );
}
