import React, { useRef, useState, useEffect } from 'react';
import { Button, IconButton, Toolbar, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
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
    editorRef.current.innerHTML = initialValue || '';
  }, [initialValue]);

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
  };

  const handleExecCommand = (command, argument = null) => {
    try {
      document.execCommand(command, false, argument);
      handleInput(); // Trigger onChange here
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  const toggleDialog = () => {
    setDialogOpen(!dialogOpen);
  };

  const addLink = () => {
    handleExecCommand('createLink', linkUrl);
    toggleDialog();
  };

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text/html');

    // Check if pasted content is an image
    if (pastedData.includes('<img')) {
      // Set image attributes to allow resizing
      const modifiedPastedData = pastedData.replace('<img', '<img contenteditable="false" resizable="true"');
      // Prevent default paste behavior
      event.preventDefault();
      // Paste the modified content
      document.execCommand('insertHTML', false, modifiedPastedData);
    }
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
        <TextField
          fullWidth
          variant="outlined"
          multiline
          rows={5}
          value={editorRef.current ? editorRef.current.innerHTML : ''}
          onChange={handleInput}
          onPaste={handlePaste} // Handle paste event
          InputProps={{
            style: { 
              minHeight: '100px',
              textAlign: 'left', // Set text alignment to left
              paddingTop: '10px', // Add padding to top
              paddingLeft: '10px', // Add padding to left
              verticalAlign: 'top' // Set vertical alignment to top
            },
            inputComponent: 'div',
            inputProps: {
              ref: editorRef,
              contentEditable: true,
              suppressContentEditableWarning: true,
              'aria-label': 'Rich Text Editor'
            }
          }}
        />
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
