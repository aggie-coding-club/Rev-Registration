import * as React from 'react';
import { Link, Dialog, Typography, DialogContent, DialogTitle } from '@material-ui/core';

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
                <DialogTitle>
                    About
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
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default About;