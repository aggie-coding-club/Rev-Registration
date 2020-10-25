import * as React from 'react';
import { Link, Dialog, Typography, DialogContent, DialogTitle } from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import * as about from './About.css';

const About: React.FC = () => {
      
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return( 
        <div className={about.container}>
            <Link
                component="button"
                variant="body2"
                onClick={handleClickOpen}
            >
                About Rev Registration
            </Link>
            <Dialog
                onClose={handleClose}
                open={open}
            >
                <DialogTitle className={about.title}>
                    About
                    <IconButton onClick={handleClose}>
                        <CloseIcon style={{ color: 'white' }}/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        <b>About</b> 
                        <p>Rev Registration is an open-source <a href="https://aggiecodingclub.com/">Aggie Coding Club</a> project
                        led by Gannon Prudhomme and Ryan Conn.</p>
                        <p>You can find all our codes on <a href="https://github.com/aggie-coding-club">Github</a>.</p>
                    </Typography>
                    <Typography gutterBottom>
                        <b>Contributors</b>
                    </Typography>
                    <Typography gutterBottom>
                        <b>Previous Contributors</b>
                    </Typography>
                    <Typography gutterBottom>
                        <b>Lisence</b>
                        <p>If you have any questions or suggestions, shoot us an email at <a href = "mailto: revregistration@gmail.com">revregistration@gmail.com</a>.</p>
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default About;