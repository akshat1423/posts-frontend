import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Typography, Paper, IconButton, Box, CardMedia } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';


function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://akshatjainiitb.pythonanywhere.com/api/posts/${id}/`)
      .then(res => {
        setPost(res.data);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete posts.');
      return;
    }

    axios.delete(`https://akshatjainiitb.pythonanywhere.com/api/posts/${id}/`, {
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

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, marginTop: '20px', marginBottom: '20px', position: 'relative' }}>
        {post ? (
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
            <Typography variant="body2" color="primary" paragraph sx={{ fontStyle: 'italic', fontSize: '1rem', color: '#1976d2', mt: 2 }}>
              {post.summary}
            </Typography>
            <Typography variant="body1" paragraph>
              {post.content.split('\n').map((paragraph, i) => (
                <React.Fragment key={i}>{paragraph}<br/></React.Fragment>
              ))}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', position: 'absolute', top: 16, right: 16 }}>
              <IconButton component={Link} to={`/edit/${post.id}`} aria-label="edit" color="primary">
                <EditIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={handleDelete} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </Paper>
    </Container>
  );
}

export default PostDetail;
