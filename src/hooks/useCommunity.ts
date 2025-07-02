import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content?: string;
  images?: string[];
  tags?: string[];
  post_type: 'transformation' | 'inspiration' | 'challenge' | 'story';
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author_name?: string;
}

interface StyleChallenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  participants_count: number;
  is_active: boolean;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  author_name?: string;
}

export const useCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [challenges, setChallenges] = useState<StyleChallenge[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (postType?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postType && postType !== 'all') {
        query = query.eq('post_type', postType);
      }

      const { data, error } = await query;

      if (error) throw error;

      const postsWithAuthors = data?.map(post => ({
        ...post,
        author_name: post.is_anonymous ? 'Anonymous' : 'StyleAI User',
        post_type: post.post_type as 'transformation' | 'inspiration' | 'challenge' | 'story'
      })) || [];

      setPosts(postsWithAuthors);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChallenges = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('style_challenges')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setChallenges(data || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  }, []);

  const createPost = useCallback(async (postData: {
    title: string;
    content?: string;
    images?: string[];
    tags?: string[];
    post_type: 'transformation' | 'inspiration' | 'challenge' | 'story';
    is_anonymous?: boolean;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          ...postData,
          user_id: user.id,
          is_anonymous: postData.is_anonymous ?? true
        }])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh posts
      fetchPosts();
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }, [user, fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('community_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        // Decrease likes count - we'll handle this in a simpler way
        const { data: currentPost } = await supabase
          .from('community_posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (currentPost) {
          await supabase
            .from('community_posts')
            .update({ likes_count: Math.max(0, currentPost.likes_count - 1) })
            .eq('id', postId);
        }
      } else {
        // Like
        await supabase
          .from('community_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        // Increase likes count
        const { data: currentPost } = await supabase
          .from('community_posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (currentPost) {
          await supabase
            .from('community_posts')
            .update({ likes_count: currentPost.likes_count + 1 })
            .eq('id', postId);
        }
      }

      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, [user, fetchPosts]);

  const addComment = useCallback(async (postId: string, content: string, isAnonymous = true) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_comments')
        .insert([{
          post_id: postId,
          user_id: user.id,
          content,
          is_anonymous: isAnonymous
        }])
        .select()
        .single();

      if (error) throw error;

      // Increase comments count
      const { data: currentPost } = await supabase
        .from('community_posts')
        .select('comments_count')
        .eq('id', postId)
        .single();
      
      if (currentPost) {
        await supabase
          .from('community_posts')
          .update({ comments_count: currentPost.comments_count + 1 })
          .eq('id', postId);
      }
      
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }, [user]);

  const getPostComments = useCallback(async (postId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data?.map(comment => ({
        ...comment,
        author_name: comment.is_anonymous ? 'Anonymous' : 'StyleAI User'
      })) || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }, []);

  const joinChallenge = useCallback(async (challengeId: string, outfitImageUrl?: string, description?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('challenge_participations')
        .insert([{
          challenge_id: challengeId,
          user_id: user.id,
          outfit_image_url: outfitImageUrl,
          description
        }])
        .select()
        .single();

      if (error) throw error;

      // Increase participants count
      const { data: currentChallenge } = await supabase
        .from('style_challenges')
        .select('participants_count')
        .eq('id', challengeId)
        .single();
      
      if (currentChallenge) {
        await supabase
          .from('style_challenges')
          .update({ participants_count: currentChallenge.participants_count + 1 })
          .eq('id', challengeId);
      }
      
      return data;
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
    fetchChallenges();
  }, [fetchPosts, fetchChallenges]);

  return {
    posts,
    challenges,
    loading,
    createPost,
    likePost,
    addComment,
    getPostComments,
    joinChallenge,
    refetchPosts: fetchPosts,
    refetchChallenges: fetchChallenges
  };
};