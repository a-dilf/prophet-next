import React from 'react';
import { Grid, Card, CardMedia } from '@mui/material';

interface ImageItem {
    src: string;
    alt: string;
}

interface LayoutProps {
    images: ImageItem[];
}

const ImageBar: React.FC<LayoutProps> = ({ images }) => {
    return (
        <Grid container spacing={2}>
            {images.slice(0, 12).map((image, index) => (
                <Grid item xs={2} sm={2} key={index}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="100%"
                            image={image.src}
                            alt={image.alt || `Image ${index + 1}`}
                        />
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ImageBar;