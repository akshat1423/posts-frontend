import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function EditPost() {
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    const [post, setPost] = useState({
        title: '',
        summary: '',
        content: '',
        image: null, 
    });
    const [file, setFile] = useState(null);
    // const isNewPost = !id;
    const isNewPost = id === "new";


    useEffect(() => {
        if (!isNewPost) {
            axios.get(`http://127.0.0.1:8000/api/posts/${id}/`)
                .then(response => {
                    setPost(response.data);
                })
                .catch(err => console.error("Failed to fetch post details:", err));
        }
    }, [id, isNewPost]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost(prevPost => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        
        formData.append('title', post.title);
        formData.append('summary', post.summary);
        formData.append('content', post.content);
        if (file) {
            formData.append('image', file);
        }
    
        const config = {
            headers: { 
                'Authorization': `Token ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        };
    
        try {
            if (isNewPost) {
                await axios.post('http://127.0.0.1:8000/api/posts/', formData, config);
            } else {
                await axios.put(`http://127.0.0.1:8000/api/posts/${id}/`, formData, config);
            }
            navigate('/');
        } catch (error) {
            console.error("Failed to save the post:", error);
        }
    };
    
    
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom margin={"20px"}>
                {isNewPost ? 'Add New Post' : 'Edit Post'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Title" name="title" value={post.title} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Summary" name="summary" value={post.summary} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Content" name="content" value={post.content} onChange={handleChange} margin="normal" required multiline rows={4} />
                <input type="file" onChange={handleFileChange} />
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained">Save</Button>
                </Box>
            </form>
        </Container>
    );
}

export default EditPost;
