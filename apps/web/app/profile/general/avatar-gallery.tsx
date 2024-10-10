import { queryProfilePictures } from "@/queries/profilePictures";
import Image from "next/image";
import { DTO } from "@august-tv/dto";
import { Query } from "@/components/Query";

export const AvatarGallery = ({
    onSelect,
}: {
    onSelect: (
        picture: DTO["user"]["getProfilePictures"]["response"]["images"][0]
    ) => void;
}) => {
    return (
        <div className="flex flex-wrap">
            <Query
                error={Query.ERROR.ALERT}
                loading={Query.LOADING.ROW}
                query={queryProfilePictures()}
            >
                {({ data: picturesSet }) =>
                    picturesSet.images.map((picture) => (
                        <Image
                            className="w-[200px] h-[200px] rounded-lg p-2 hover:bg-slate-200 dark:hover:bg-slate-900 cursor-pointer"
                            key={picture.id}
                            src={picture.medium.publicUrl}
                            alt="Profile picture"
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
