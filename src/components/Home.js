import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardActions, CardContent, Typography, IconButton, Container, CardMedia, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Lock, LockOpen, Favorite, FavoriteBorder } from '@mui/icons-material'; // Import icons for like button

function Home() {
    const [posts, setPosts] = useState([]);
    let navigate = useNavigate();
    const { currentUser } = useAuth(); 

    useEffect(() => {
        axios.get('https://akshatjsarc.pythonanywhere.com/api/posts/')
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    const isAuthenticated = () => {
        return !!currentUser;
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        if (!currentUser) { 
            alert('You must be logged in to delete posts.');
            return;
        }
        
        axios.delete(`http://127.0.0.1:8000/api/posts/${id}/`, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(() => {
            setPosts(posts.filter(post => post.id !== id));
        })
        .catch(err => {
            console.error(err);
            alert('Failed to delete post. Please try again.');
        });
    };

    const handleLike = (postId) => {
        const token = localStorage.getItem('token');
        if (!currentUser) { 
            alert('You must be logged in to like posts.');
            return;
        }
        console.log(posts.find(post => post.id === postId)?.likes.includes(currentUser))
        const isPostLiked = posts.find(post => post.id === postId)?.likes.includes(currentUser);

        axios.post(`https://akshatjsarc.pythonanywhere.com/api/posts/${postId}/like/`, {}, {
            headers: {
                Authorization: `Token ${token}`
            }
        })
        .then(() => {
            // Refresh posts after liking/unliking
            axios.get('https://akshatjsarc.pythonanywhere.com/api/posts/')
                .then(res => {
                    setPosts(res.data);
                })
                .catch(err => console.error(err));
        })
        .catch(err => {
            console.error(err);
            alert('Failed to like post. Please try again.');
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom margin={"20px"}>Posts</Typography>
            {isAuthenticated() && (
                <Button 
                  startIcon={<AddCircleOutlineIcon />}
                  variant="contained" 
                  color="primary" 
                  onClick={() => navigate('/edit/new')} 
                  sx={{ marginBottom: 2 }}>
                    Create Post
                </Button>
            )}
            <Grid container spacing={4}>
                {posts.map(post => (
                    <Grid item xs={12} sm={6} lg={4} key={post.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {post.image && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={post.image}
                                    alt={post.title}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }} onClick={() => navigate(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>
                                <Typography variant="h5" component="h2">{post.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{post.summary}</Typography>
                                <Typography variant="body2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>By {post.author_name}</span><span>
                                    {post.is_private ? (
                                        <>
                                        <Lock fontSize="x-small" /> Private
                                        </>
                                    ) : (
                                        <>
                                        <LockOpen fontSize="x-small" /> Public
                                        </>
                                    )}</span>
                                </Typography>
                                {/* Display number of likes */}
                                
                            </CardContent>
                            <CardActions>
                                {/* Like button */}
                                <IconButton aria-label="like" onClick={() => handleLike(post.id)}>
                                    {post.likes.includes(currentUser) ? <Favorite color="error" /> : <FavoriteBorder />}
                                </IconButton><Typography variant="body2">{post.likes_count}</Typography>
                                {/* Edit and delete buttons */}
                                {isAuthenticated() && (
                                    <>
                                        <IconButton component={Link} to={`/edit/${post.id}`} aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => handleDelete(post.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Home;
