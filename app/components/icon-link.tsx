import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import type { UrlObject } from "url";

interface IconLinkProps {
    className?: string;
    icon: IconDefinition;
    hrefObj: UrlObject;
    disabled: boolean;
}

export default function IconLink({ className, icon, hrefObj, disabled }: IconLinkProps) {
    function checkIfDisabled(e: React.MouseEvent) {
        if (disabled) {
            e.preventDefault();
        }
    }

    return (
        <Link className={className} href={hrefObj} aria-disabled={disabled} onClick={(e) => checkIfDisabled(e)}>
            <FontAwesomeIcon className="text-4xl md:text-5xl hover:text-cool-sky-300" icon={icon} />
        </Link>
    )
}