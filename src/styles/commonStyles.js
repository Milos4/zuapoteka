// styles/commonStyles.js
const sectionBox = {
  backgroundColor: '#E4EFE7',
  flex: '1 1 100%',
  minWidth: '300px',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: `
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(0, 104, 53, 0.1)
  `,
  marginBottom: '2rem',
  position: 'relative',
  overflow: 'hidden',
  zIndex: '1',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    height: '5px',
    background: 'linear-gradient(90deg, #00C853, #006835, #00C853)',
    backgroundSize: '200% 100%',
    animation: 'gradientShift 3s ease infinite',
    zIndex: '2',
  },
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'linear-gradient(135deg, rgba(0,200,83,0.1) 0%, transparent 50%)',
    zIndex: '-1',
    opacity: '0',
    transition: 'opacity 0.5s ease',
  },
  
  '&:hover::after': {
    opacity: '1',
  },
  
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `
      0 6px 12px rgba(0, 0, 0, 0.15),
      inset 0 0 30px rgba(0, 104, 53, 0.2)
    `,
  }
};

const sectionHeading = {
  color: '#006835',
  marginBottom: '1.5rem',
  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
  fontWeight: '700',
  lineHeight: '1.3',
  position: 'relative',
  display: 'inline-block',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-8px',
    left: '0',
    width: '50%',
    height: '3px',
    background: 'linear-gradient(90deg, #00C853, transparent)',
    transition: 'width 0.3s ease',
  },
  
  '&:hover::after': {
    width: '100%',
  }
};

const sectionParagraph = {
  marginBottom: '1rem',
  fontSize: 'clamp(1rem, 2vw, 1.5rem)',
  lineHeight: '1.6',
  color: '#333',
  transition: 'transform 0.3s ease',
  
  '&:hover': {
    transform: 'translateX(5px)'
  }
};

const globalStyles = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

export { sectionBox, sectionHeading, sectionParagraph, globalStyles };