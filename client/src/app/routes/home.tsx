import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '@/theme/AppTheme';
import AppAppBar from '@/components/appbar/AppAppBar';
import Footer from '@/components/footer/Footer';
import Banner from '@/components/banner/Banner';

export default function MarketingPage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Banner />
      <div>
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
