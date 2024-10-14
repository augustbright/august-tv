import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export const AuthorPicture = ({
  author
}: {
  author: {
    picture: {
      small?: {
        publicUrl: string;
      };
    } | null;
    nickname: string;
  };
}) => (
  <Avatar>
    <AvatarImage
      src={author.picture?.small?.publicUrl}
      alt={author.nickname}
    />
    <AvatarFallback>{author.nickname[0]}</AvatarFallback>
  </Avatar>
);
