import { Typography, Paper, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppTheme from '../theme/AppTheme';
import HomeNavBar from '../components/HomeNavBar';
import Toolbar from '@mui/material/Toolbar';
import Footer from '../components/footer/Footer';

export const HomePage = (props: { disableCustomTheme?: boolean }) => {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <HomeNavBar />
      <Toolbar/>
      <Paper elevation={0} sx={{ p: 4 }} square>
        <Typography variant="h4" gutterBottom>
          Welcome to the AcuityView Dashboard
        </Typography>
        <Typography>
          This project demonstrates <strong>AcuityView</strong>, a modern{' '}
          <strong>clinical intelligence platform</strong>. It provides
          at-a-glance insights into hospital operations and patient acuity
          through the <strong>AcuityView Dashboard</strong>, while its core
          innovation is the <strong>Acuity CoPilot</strong>. The CoPilot is a
          sophisticated chatbot designed to help doctors fast-track patient
          information. It is powered by a{' '}
          <strong>Retrieval-Augmented Generation (RAG)</strong> system that
          utilizes <strong>Natural Language Understanding (NLU)</strong>,{' '}
          <strong>Large Language Models (LLMs)</strong>, and machine learning
          techniques to provide precise, context-aware answers from complex
          clinical notes. The entire platform is built from scratch using a{' '}
          <strong>production-grade technology stack</strong>.
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          Core Technologies:
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>React & Vite for a blazinag-fast frontend.</li>
          <li>Material-UI (MUI) for a rich, responsive component library.</li>
          <li>Express.js & TypeScript for a robust and scalable backend.</li>
          <li>A full suite of testing and CI/CD best practices.</li>
        </Box>
        <Typography variant="body1" sx={{ mt: 3 }}>
          Click the "Demo" link in the navigation bar to proceed to the login
          page and explore the application.
        </Typography>
      </Paper>
      <Divider />
      <Footer />
    </AppTheme>
  );
};
