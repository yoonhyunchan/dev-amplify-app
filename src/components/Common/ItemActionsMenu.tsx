import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import type { Item } from "@/lib/amplify-client"
import DeleteItem from "../Items/DeleteItem"
import EditItem from "../Items/EditItem"
import { MenuContent, MenuRoot, MenuTrigger } from "../ui/menu"

interface ItemActionsMenuProps {
  item: Item
}

export const ItemActionsMenu = ({ item }: ItemActionsMenuProps) => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <IconButton variant="ghost" color="inherit">
          <BsThreeDotsVertical />
        </IconButton>
      </MenuTrigger>
      <MenuContent>
        <EditItem item={item} />
        <DeleteItem id={item.id} />
      </MenuContent>
    </MenuRoot>
  )
}
