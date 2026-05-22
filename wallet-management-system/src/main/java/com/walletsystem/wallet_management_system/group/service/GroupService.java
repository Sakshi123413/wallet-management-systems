package com.walletsystem.wallet_management_system.group.service;

import com.walletsystem.wallet_management_system.group.dto.GroupRequest;
import com.walletsystem.wallet_management_system.group.dto.GroupResponse;

import java.util.List;

public interface GroupService {
    List<GroupResponse> getAllGroups();
    GroupResponse getGroupById(Long id);
    GroupResponse createGroup(GroupRequest request);
    GroupResponse updateGroup(Long id, GroupRequest request);
    void deleteGroup(Long id);
}
