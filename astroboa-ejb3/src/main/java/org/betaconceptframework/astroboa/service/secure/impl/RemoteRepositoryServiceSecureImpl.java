/*
 * Copyright (C) 2005-2011 BetaCONCEPT LP.
 *
 * This file is part of Astroboa.
 *
 * Astroboa is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Astroboa is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Astroboa.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.betaconceptframework.astroboa.service.secure.impl;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.ejb.Remote;
import javax.ejb.Stateless;
import javax.ejb.TransactionManagement;
import javax.ejb.TransactionManagementType;

import org.betaconceptframework.astroboa.api.service.RepositoryService;
import org.betaconceptframework.astroboa.api.service.secure.remote.RemoteRepositoryServiceSecure;
import org.betaconceptframework.astroboa.service.secure.security.SecurityService;
import org.springframework.context.ApplicationContext;

/**
 * @author Gregory Chomatas (gchomatas@betaconcept.com)
 * @author Savvas Triantafyllou (striantafyllou@betaconcept.com)
 * 
 */
@Remote({RemoteRepositoryServiceSecure.class})
@Stateless(name="RemoteRepositoryServiceSecure")
@TransactionManagement(TransactionManagementType.BEAN)
public class RemoteRepositoryServiceSecureImpl extends RepositoryServiceSecureImpl implements RemoteRepositoryServiceSecure{

	@Resource(name="astroboa.engine.context", mappedName="astroboa.engine.context")
	private ApplicationContext springManagedRepositoryServicesContext;
	
	@Resource(name="SecurityService", mappedName="SecurityService/local")
	private SecurityService securityService;

	@PostConstruct
	public void initialize() {
		repositoryService = (RepositoryService) springManagedRepositoryServicesContext.getBean("repositoryService");
	}
	
	@Override
	protected SecurityService getSecurityService() {
		return securityService;
	}


}