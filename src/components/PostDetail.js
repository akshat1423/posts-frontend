import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Paper, IconButton, Box, CardMedia, Switch, FormControlLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState((localStorage.getItem('userName'))); // Assume user info is stored in localStorage
  const [error, setError] = useState('');
  const [reloadPage, setReloadPage] = useState(false); 
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`http://127.0.0.1:8000/api/posts/${id}/`, 
    {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => {
        console.log("Post Data:", res.data); // Log post data for debugging
        setPost(res.data);
      })
      .catch(err => {
        console.error("Error fetching post:", err);
        setError('Private post, please login from that account to view this post');
      });
  }, [id,reloadPage]);

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete posts.');
      return;
    }

    axios.delete(`http://127.0.0.1:8000/api/posts/${id}/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(() => {
      navigate("/");
    })
    .catch(err => {
      console.error(err);
      alert('Failed to delete post. Please try again.');
    });
  };

  const togglePrivacy = (event) => {
    const updatedPrivacy = event.target.checked;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to change the privacy settings.');
      return;
    }

    axios.patch(`http://127.0.0.1:8000/api/posts/${id}/`, { is_private: updatedPrivacy }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {
      setPost({...post, is_private: updatedPrivacy});
    })
    .catch(err => {
      console.error(err);
      alert('Failed to update privacy settings.');
    });
  };

  if (error) {
    return    <Container
    maxWidth="md"
    className="center-container" // Add your custom class here
    style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Box bgcolor="error.main" color="error.contrastText" p={2} borderRadius={4}>
      <Typography variant="body1">{error}</Typography>
    </Box>
  </Container>;
  }

  if (!post) {
    return <Container maxWidth="md"><Typography variant="body1">Loading or no post data...</Typography></Container>;
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, marginTop: '20px', marginBottom: '20px', position: 'relative' }}>
        <>
          {post.image && (
            <CardMedia
              component="img"
              image={post.image}
              alt={post.title}
              sx={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px' }}
            />
          )}
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            By {post.author_name} | {moment(post.created_at).format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
          {user && user === post.author_name && (
            <FormControlLabel
              control={
                <Switch
                  checked={post.is_private}
                  onChange={togglePrivacy}
                  color="primary"
                />
              }
              label="Private Post"
            />
          )}
          <Typography variant="body2" color="primary" paragraph sx={{ fontStyle: 'italic', fontSize: '1rem', color: '#1976d2', mt: 2 }}>
            {post.summary}
          </Typography>
          <Typography variant="body1" paragraph>
            {post.content.split('\n').map((paragraph, i) => (
              <React.Fragment key={i}>{paragraph}<br/></React.Fragment>
            ))}
          </Typography>
          {user && user.id === post.author_id && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 16, right: 16 }}>
              <IconButton component={Link} to={`/edit/${post.id}`} aria-label="edit" color="primary">
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </>
      </Paper>
    </Container>
  );
}

export default PostDetail;
