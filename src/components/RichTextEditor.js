// RichTextEditor.js

import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, IconButton, Toolbar, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LinkIcon from '@mui/icons-material/Link';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

const RichTextEditor = ({ initialValue, onChange }) => {
  const editorRef = useRef(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const handleExecCommand = (command, argument = null) => {
    document.execCommand(command, false, argument);
    onChange(editorRef.current.innerHTML);
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const addLink = () => {
    handleExecCommand('createLink', linkUrl);
    toggleDialog();
  };

  return (
    <Grid container direction="column" alignItems="stretch">
      <Grid item>
        <Toolbar disableGutters style={{ flexWrap: "wrap" }}>
          <IconButton onClick={() => handleExecCommand('bold')}><FormatBoldIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('italic')}><FormatItalicIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('underline')}><FormatUnderlinedIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('justifyLeft')}><FormatAlignLeftIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('justifyCenter')}><FormatAlignCenterIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('justifyRight')}><FormatAlignRightIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('justifyFull')}><FormatAlignJustifyIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('insertOrderedList')}><FormatListNumberedIcon /></IconButton>
          <IconButton onClick={() => handleExecCommand('insertUnorderedList')}><FormatListBulletedIcon /></IconButton>
          <IconButton onClick={toggleDialog}><LinkIcon /></IconButton>
        </Toolbar>
      </Grid>
      <Grid item>
        <Box sx={{ border: '1px solid #ccc', padding: '10px', minHeight: '150px', cursor: 'text', borderRadius: '4px', ':focus-within': { borderColor: 'primary.main' } }}>
          <div ref={editorRef} contentEditable style={{ outline: 'none', minHeight: '100px' }} aria-label="Rich Text Editor" />
        </Box>
      </Grid>
      <Dialog open={dialogOpen} onClose={toggleDialog}>
        <DialogTitle>Insert a Link</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="link"
            label="URL"
            type="url"
            fullWidth
            variant="standard"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog}>Cancel</Button>
          <Button onClick={addLink}>Add Link</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RichTextEditor;
