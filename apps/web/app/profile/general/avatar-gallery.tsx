import { Query } from '@/components/Query';
import { queryProfilePictures } from '@/queries/profilePictures';
import { File as PrismaFile, Image as PrismaImage } from '@prisma/client';

import Image from 'next/image';

export type TImageFromGallery = PrismaImage & {
  original: Pick<PrismaFile, 'publicUrl'>;
};

export const AvatarGallery = ({
  onSelect
}: {
  onSelect: (picture: TImageFromGallery) => void;
}) => {
  return (
    <div className='flex flex-wrap'>
      <Query
        error={Query.ERROR.ALERT}
        loading={Query.LOADING.ROW}
        query={queryProfilePictures()}
      >
        {({ data: picturesSet }) =>
          picturesSet.images.map((picture) => (
            <Image
              className='w-[200px] h-[200px] rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-900 cursor-pointer'
              key={picture.id}
              src={picture.medium.publicUrl}
              alt='Profile picture'
              width={200}
              height={200}
              onClick={() => onSelect(picture)}
            />
          ))
        }
      </Query>
    </div>
  );
};
