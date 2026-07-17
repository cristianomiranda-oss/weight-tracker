import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

interface IconLinkProps {
    className?: string;
    icon: IconDefinition;
    href: string;
}

export default function IconLink({ className, icon, href }: IconLinkProps) {
    return (
        <Link className={className} href={href}>
            <FontAwesomeIcon className="text-4xl md:text-5xl hover:text-cool-sky-300" icon={icon} />
        </Link>
    )
}