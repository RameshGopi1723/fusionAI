import React, { useState } from 'react';
import { 
  AppBar, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BuildIcon from '@mui/icons-material/Build';
import ContactMailIcon from '@mui/icons-material/ContactMail';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'About', icon: <InfoIcon />, path: '/about' },
    { text: 'Services', icon: <BuildIcon />, path: '/services' },
    { text: 'Contact', icon: <ContactMailIcon />, path: '/contact' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <AppBar position="static" sx={{ maxWidth: '100%' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            GenTech
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              component="a" 
              href={item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;